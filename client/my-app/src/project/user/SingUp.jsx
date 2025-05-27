import React, { useContext, useState } from 'react';
import { Box, Button, Container, Link, TextField, FormControlLabel, Checkbox, Grid, Typography, CssBaseline, IconButton } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
  const { login } = useContext(UserContext);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); 
  const nav = useNavigate();

  const validateUsername = (value) => {
    if (value.length < 3) return "שם משתמש חייב להכיל לפחות 3 תווים";
    if (value.length > 20) return "שם משתמש לא יכול להכיל יותר מ-20 תווים";
    return "";
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "כתובת מייל לא תקינה";
  };

  const validatePassword = (value) => {
    return value.length < 6 ? "הסיסמה חייבת להכיל לפחות 6 תווים" : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    let errorMsg = "";
    if (name === "username") errorMsg = validateUsername(value);
    if (name === "email") errorMsg = validateEmail(value);
    if (name === "password") errorMsg = validatePassword(value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (errors.username || errors.email || errors.password || !user.username || !user.email || !user.password) {
      setType("error");
      setMessage("יש לתקן את כל השגיאות לפני שליחה");
      return;
    }
    try {
      console.log(':)');
      
      const response = await axios.post('http://localhost:3000/users/signup', user);
      if (response.status === 200) {
        login(response.data.newUser);
        localStorage.setItem('user', JSON.stringify(response.data.newUser)); // ✅ שומר ב-localStorage
        setType("success");
        nav("/home");
      }
      
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL + "/סדנאות_בישול_לעובדים_בחברת_הייטק.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ zIndex: 1 }}>
        <CssBaseline />
        <Box
          sx={{
            marginBottom: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            backgroundColor: 'transparent',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'black' }}>
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="שם משתמש"
              autoFocus
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-root': { color: 'black' } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="כתובת מייל"
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-root': { color: 'black' } }}
            />
            <Box sx={{ position: 'relative' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמא"
                onChange={handleChange}
                type={showPassword ? "text" : "password"} 
                error={!!errors.password}
                helperText={errors.password}
                sx={{ '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-root': { color: 'black' } }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)} 
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'black'
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} 
              </IconButton>
            </Box>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="אני רוצה לקבל עדכונים במייל."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'black' } }}
            >
              הרשמה
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2" sx={{ color: 'black' }}>
                  יש לך כבר חשבון? היכנס
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
