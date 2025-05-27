import React, { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

export default function LogIn() {
  const { login } = useContext(UserContext);
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); 
  const nav = useNavigate();

  const validateUsername = (value) => {
    return value.length < 3 ? "שם משתמש חייב להכיל לפחות 3 תווים" : "";
  };

  const validatePassword = (value) => {
    return value.length < 6 ? "הסיסמה חייבת להכיל לפחות 6 תווים" : "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    let errorMsg = "";
    if (name === "username") errorMsg = validateUsername(value);
    if (name === "password") errorMsg = validatePassword(value);
    
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (errors.username || errors.password || !userData.username || !userData.password) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/users/login', userData);
      if (response.status === 200) {
        login(response.data);
        nav("/home");
      }
    } catch (err) {
      console.error(err);
      nav('/signup');
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
            התחברות
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="שם משתמש"
              name="username"
              autoComplete="username"
              autoFocus
              onBlur={handleBlur}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ '& .MuiInputLabel-root': { color: 'black' }, '& .MuiOutlinedInput-root': { color: 'black' } }}
            />
            <Box sx={{ position: 'relative' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="סיסמא"
                type={showPassword ? "text" : "password"} 
                id="password"
                autoComplete="current-password"
                onBlur={handleBlur}
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
              control={<Checkbox value="remember" color="primary" />}
              label="זכור אותי"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'black' } }}
            >
              התחברות
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ color: 'black' }}>
                  ?שכחת את הסיסמא
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ color: 'black' }}>
                  {"אין לך חשבון?  לחץ להרשמה"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
