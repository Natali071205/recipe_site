import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { green, red } from "@mui/material/colors";

const AddCategoryManager = () => {
  const [categoryData, setCategoryData] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({ name: "", image: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = { name: "", image: "" };
    if (categoryData.name.length < 3) {
      newErrors.name = "שם קטגוריה חייב להיות לפחות 3 תווים";
    }
    if (!image) {
      newErrors.image = "יש להוסיף תמונה";
    }
    setErrors(newErrors);
    return !newErrors.name && !newErrors.image;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", categoryData.name);

    try {
      const response = await axios.post("http://localhost:3000/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status >= 200 && response.status < 300) {
        setSnackbarMessage("הקטגוריה נוספה בהצלחה!");
        setSnackbarType("success");
        setOpenSnackbar(true);
        setCategoryData({ name: "" });
        setImage(null);

        // ממתינים 2 שניות ואז מנווטים
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        throw new Error("שגיאה בתגובה מהשרת");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setSnackbarMessage("אירעה שגיאה במהלך הוספת הקטגוריה.");
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/profilllee.jpg)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          top: "194px",
          right: "13px",
          p: 3,
          mx: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          mt: 5,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 4,
          boxShadow: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          הוספת קטגוריה חדשה
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="שם קטגוריה"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
            autoFocus
          />
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.image)}
          />
          {errors.image && (
            <FormHelperText error>{errors.image}</FormHelperText>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: "black" }}
          >
            הוסף קטגוריה
          </Button>
        </form>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarType === "success" ? green[500] : red[500],
            color: "#fff",
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </>
  );
};

export default AddCategoryManager;
