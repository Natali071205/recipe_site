import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, InputAdornment, Snackbar, SnackbarContent } from "@mui/material";
import { UserContext } from './Context';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { green, red } from "@mui/material/colors";

const UpdateUser = () => {
  const { user, updateUser } = useContext(UserContext);
  const [userData, setUserData] = useState({
    username: user?.username,
    password: user?.password,
    confirmPassword: "",
    email: user?.email,
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarType, setSnackbarType] = useState("success"); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = { username: "", password: "", confirmPassword: "" };

    if (userData.username.length < 3) {
      newErrors.username = "שם המשתמש חייב להיות באורך מינימלי של 3 תוים";
    }
    if (userData.password.length < 6) {
      newErrors.password = "הסיסמה חייבת להיות באורך מינימלי של 6 תוים";
    }
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות אינן תואמות";
    }

    setErrors(newErrors);

    return !newErrors.username && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updatedUserData = {
        username: userData.username,
        password: userData.password,
      };

      const response = await axios.put(`http://localhost:3000/users/${user._id}`, updatedUserData);

      if (response.status === 200) {
        setSnackbarMessage("המשתמש עודכן בהצלחה");
        setSnackbarType("success");
        updateUser(response.data);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("אירעה שגיאה בעת עדכון המשתמש");
      setSnackbarType("error");
    }

    setOpenSnackbar(true); 
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/profilllee.jpg)';
    document.body.style.backgroundSize = 'cover';  
    document.body.style.backgroundPosition = 'center';  
    document.body.style.backgroundRepeat = 'no-repeat'; 
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
          top: "150px", 
          p: 3,
          maxWidth: 600,
          mx: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, -0.3)',  // יותר שקוף
          padding: 4,
          boxShadow: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          עדכון פרטי משתמש
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="שם משתמש"
            name="username"
            value={userData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          
          <TextField
            label="סיסמה"
            name="password"
            value={userData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="אימות סיסמה"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="מייל"
            value={userData.email}
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            עדכן משתמש
          </Button>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <SnackbarContent
            sx={{
              backgroundColor: snackbarType === "success" ? green[500] : red[500],
              color: "#fff",
            }}
            message={snackbarMessage}
          />
        </Snackbar>
      </Box>
    </>
  );
};

export default UpdateUser;
