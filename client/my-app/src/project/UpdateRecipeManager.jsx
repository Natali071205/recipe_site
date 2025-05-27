import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";

const UpdateRecipeManager = () => {
  const [recipeData, setRecipeData] = useState({});
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [stepInput, setStepInput] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const { recipeId } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/${recipeId}`);
        if (response.status === 200) {
          setRecipeData(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        alert("שגיאה בטעינת המתכון.");
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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
      setRecipeData((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index) => {
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addStep = () => {
    if (stepInput.trim()) {
      setRecipeData((prev) => ({
        ...prev,
        preparationSteps: [...(prev.preparationSteps || []), stepInput.trim()],
      }));
      setStepInput("");
    }
  };

  const removeStep = (index) => {
    setRecipeData((prev) => ({
      ...prev,
      preparationSteps: prev.preparationSteps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);

    Object.keys(recipeData).forEach((key) => {
      if (recipeData[key] !== null && recipeData[key] !== undefined) {
        formData.append(
          key,
          Array.isArray(recipeData[key]) ? JSON.stringify(recipeData[key]) : recipeData[key]
        );
      }
    });

    try {
      const response = await axios.put(`http://localhost:3000/recipes/${recipeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setSuccessOpen(true);
      } else {
        setErrorOpen(true);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      setErrorOpen(true);
    }
  };

  const handleKeyDown = (e, addFunction) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFunction();
    }
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
    <>
      {/* הודעת הצלחה */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          המתכון עודכן בהצלחה!
        </Alert>
      </Snackbar>

      {/* הודעת שגיאה */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
          עדכון המתכון נכשל. נסי שוב מאוחר יותר.
        </Alert>
      </Snackbar>

      <Box
        sx={{
          position: "relative",
          top: "20px",
          p: 3,
          maxWidth: 600,
          mx: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          mt: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
          boxShadow: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          עדכון מתכון
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="שם המתכון"
            name="name"
            value={recipeData.name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="תאריך פרסום"
            type="date"
            name="publishDate"
            value={recipeData.publishDate ? recipeData.publishDate.slice(0, 10) : ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>בחר קטגוריה</InputLabel>
            <Select
              name="categoryCode"
              value={recipeData.categoryCode || ""}
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
            value={recipeData.preparationTime || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="תפוקה סופית"
            name="finalYield"
            value={recipeData.finalYield || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="לייקים"
            type="number"
            name="likes"
            value={recipeData.likes || ""}
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
            {(recipeData.ingredients || []).map((ing, index) => (
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
            {(recipeData.preparationSteps || []).map((step, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => removeStep(index)}>
                  <DeleteIcon />
                </IconButton>
              }>
                {step}
              </ListItem>
            ))}
          </List>

          {/* תמונה */}
          <Box sx={{ mt: 2 }}>
            <InputLabel sx={{ mb: 1 }}>תמונה</InputLabel>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "black",
                },
              }}
              component="label"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="תמונה חדשה"
                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                />
              ) : recipeData.image ? (
                <img
                  src={`http://localhost:3000/${recipeData.image}`}
                  alt="תמונה נוכחית"
                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                />
              ) : (
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#eee",
                    borderRadius: 4,
                    marginRight: 1,
                  }}
                />
              )}

              <Typography sx={{ color: "#888" }}>
                {image ? image.name : "לחצי כדי לבחור תמונה"}
              </Typography>

              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Box>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, backgroundColor: "black" }}>
            עדכן מתכון
          </Button>
        </form>
      </Box>
    </>
  );
};

export default UpdateRecipeManager;
