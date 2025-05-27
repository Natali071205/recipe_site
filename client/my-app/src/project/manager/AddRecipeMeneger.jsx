import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { green, red } from "@mui/material/colors";

const AddRecipeManager = () => {
  const [recipeData, setRecipeData] = useState({
    name: "",
    publishDate: "",
    categoryCode: "",
    preparationTime: "",
    ingredients: [],
    preparationSteps: [],
    finalYield: "",
    likes: 0,
  });

  const [image, setImage] = useState(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [stepInput, setStepInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSnackbarMessage("אירעה שגיאה בטעינת קטגוריות");
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setRecipeData({
      ...recipeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setRecipeData({
        ...recipeData,
        ingredients: [...recipeData.ingredients, ingredientInput.trim()],
      });
      setIngredientInput("");
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setRecipeData({
        ...recipeData,
        preparationSteps: [...recipeData.preparationSteps, stepInput.trim()],
      });
      setStepInput("");
    }
  };

  const removeStep = (index) => {
    const newSteps = recipeData.preparationSteps.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, preparationSteps: newSteps });
  };

  const validateForm = () => {
   
    const today = new Date().toISOString().split("T")[0]; 
    if (recipeData.publishDate < today) {
      setSnackbarMessage("תאריך פרסום חייב להיות מהיום ומעלה.");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return false;
    }
    if (isNaN(recipeData.preparationTime) || recipeData.preparationTime <= 0) {
      setSnackbarMessage("זמן הכנה חייב להיות מספר חיובי.");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return false;
    }
    if (isNaN(recipeData.finalYield) || recipeData.finalYield <= 0) {
      setSnackbarMessage("תפוקה סופית חייבת להיות מספר חיובי.");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (
      !recipeData.name ||
      !recipeData.publishDate ||
      !recipeData.categoryCode ||
      !recipeData.preparationTime ||
      !recipeData.finalYield ||
      recipeData.likes === null || recipeData.likes === undefined
    ) {
      setSnackbarMessage("נא למלא את כל השדות הנדרשים!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    
    if (!validateForm()) return;

   
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", recipeData.name);  
    formData.append("publishDate", recipeData.publishDate);
    formData.append("categoryCode", recipeData.categoryCode);
    formData.append("preparationTime", recipeData.preparationTime);
    formData.append("ingredients", JSON.stringify(recipeData.ingredients));
    formData.append("preparationSteps", JSON.stringify(recipeData.preparationSteps));
    formData.append("finalYield", recipeData.finalYield);
    formData.append("likes", recipeData.likes);

    try {
      const response = await axios.post("http://localhost:3000/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSnackbarMessage("המתכון נוסף בהצלחה!");
        setSnackbarType("success");
        setSnackbarOpen(true);
        setRecipeData({
          name: "",
          publishDate: "",
          categoryCode: "",
          preparationTime: "",
          ingredients: [],
          preparationSteps: [],
          finalYield: "",
          likes: 0,
        });
        setImage(null);
      } else {
        setSnackbarMessage("הוספת המתכון נכשלה.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      setSnackbarMessage("אירעה שגיאה במהלך הוספת המתכון.");
      setSnackbarType("error");
      setSnackbarOpen(true);
    }
  };

  const handleKeyDown = (e, addFunction) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFunction();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/profilllee.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.height = '100vh'; 
    return () => {
      document.body.style.backgroundImage = ""; 
    };
  }, []);

  return (
    <Box
      sx={{
        position:"relative",
        top:"20px",
        p: 3,
        maxWidth: 600,
        mx: "auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        mt: 5,
        backgroundColor: 'rgba(255, 255, 255, -0.2)', 
        padding: 4,
        boxShadow: 3,
        width: '100%',
        maxWidth: 500,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        הוספת מתכון חדש
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="שם המתכון"
          name="name"
          value={recipeData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="תאריך פרסום"
          type="date"
          name="publishDate"
          value={recipeData.publishDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        
        <FormControl fullWidth margin="normal">
          <InputLabel>בחר קטגוריה</InputLabel>
          <Select
            name="categoryCode"
            value={recipeData.categoryCode}
            onChange={handleChange}
            label="בחר קטגוריה"
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="זמן הכנה (בדקות)"
          type="number"
          name="preparationTime"
          value={recipeData.preparationTime}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="תפוקה סופית"
          name="finalYield"
          value={recipeData.finalYield}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="הוסף מרכיב"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, addIngredient)}
            fullWidth
            margin="normal"
          />
          <IconButton onClick={addIngredient} sx={{ ml: 2 }}>
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {recipeData.ingredients.map((ing, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" onClick={() => removeIngredient(index)}>
                <DeleteIcon />
              </IconButton>
            }>
              {ing}
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="הוסף שלב הכנה"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, addStep)}
            fullWidth
            margin="normal"
          />
          <IconButton onClick={addStep} sx={{ ml: 2 }}>
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {recipeData.preparationSteps.map((step, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" onClick={() => removeStep(index)}>
                <DeleteIcon />
              </IconButton>
            }>
              {step}
            </ListItem>
          ))}
        </List>

        <TextField
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={handleImageChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, backgroundColor: "black" }}>
          הוסף מתכון
        </Button>
      </form>

    
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          message={snackbarMessage}
          style={{
            backgroundColor: snackbarType === "success" ? green[600] : red[600],
          }}
        />
      </Snackbar>
    </Box>
  );
};

export default AddRecipeManager;
