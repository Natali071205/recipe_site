import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CottageIcon from '@mui/icons-material/Cottage';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from './Context';
import Search from './Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // אייקון התנתקות
import PersonIcon from '@mui/icons-material/Person'; // אייקון פרופיל

const NavBar = () => {
  const { user, logout } = useContext(UserContext); 
  const navigate = useNavigate();
  
  const userpages = [
    { name: "התנתקות", route: 'home', icon: <ExitToAppIcon /> },  // הוספת האייקון של התנתקות
    { name: "עדכון פרופיל", route: 'UpdateUser', icon: <PersonIcon /> } // הוספת האייקון של פרופיל
  ];

  const pages = user && user.isAdmin
    ? [
      { name: "כל המתכונים", route: 'home' },
      { name: "אודות", route: 'about' },
      { name: "הוספת קטגוריה", route: 'AddCategoryManager' },
      { name: "הוספת מתכון", route: 'AddRecipeMeneger' }
    ]
    : [
      { name: "כל המתכונים", route: 'home' },
      { name: "אודות", route: 'about' },
      { name: "התחברות", route: 'login' },
      { name: "הרשמה", route: 'signup' }
    ];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page) => {
    const route = `/${page.route}`;
    navigate(route);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout(); 
    handleCloseUserMenu(); 
    navigate('/home');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#dc4337', position: 'fixed', top: '0px', zIndex: 999 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex' }}>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.username} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userpages.map((page, index) => (
                  <MenuItem key={index} onClick={() => {
                    if (page.name === "התנתקות") {
                      handleLogout(); 
                    } else {
                      handleNavigate(page); 
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {page.icon}
                      <Typography textAlign="center" sx={{ ml: 1 }}>
                        {page.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <Search />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={() => handleNavigate(page)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'row-reverse', paddingRight: '38px' }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={() => handleNavigate(page)}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <CottageIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            מתכונים
          </Typography>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            מתכונים
          </Typography>
          <Link to="/home">
            <CottageIcon sx={{ display: { color: 'black', xs: 'none', md: 'flex' }, mr: 1 }} />
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
