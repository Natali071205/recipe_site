import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, CardMedia, Typography, Box,
  CircularProgress, IconButton, CardActions, Button, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { UserContext } from './Context';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import EditIcon from '@mui/icons-material/Edit';

const CategoryRecipe = () => {
  const { categoryId, categoryName } = useLocation().state;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  console.log(user);
  console.log('user.isAdmin:', user?.isAdmin);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    const getAllRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/category/${categoryId}`);
        const recipesWithLikes = response.data.map(recipe => ({
          ...recipe,
          isLiked: false,
        }));
        setRecipes(recipesWithLikes);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    getAllRecipes();
  }, [categoryId]);

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:3000/recipes/${recipeId}`);
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Error deleting recipe:', err);
    }
  };

  const updateRecipeLikes = async (recipe) => {
    try {
      const updatedLikes = recipe.likes + 1;
      await axios.put(`http://localhost:3000/recipes/${recipe._id}`, { likes: updatedLikes });
      const updatedRecipes = recipes.map(r =>
        r._id === recipe._id ? { ...r, likes: updatedLikes, isLiked: true } : r
      );
      setRecipes(updatedRecipes);
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const toggleLike = (recipe) => {
    if (!recipe.isLiked) {
      updateRecipeLikes(recipe);
    } else {
      console.log('Already liked');
    }
  };

  const handleDeleteRecipe = (recipeId) => {
    setRecipeToDelete(recipeId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteRecipe = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete);
    }
  };

  const cancelDeleteRecipe = () => {
    setOpenDeleteDialog(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ paddingTop: "80px" }}>
      <Typography
        gutterBottom
        align="center"
        variant="h4"
        sx={{ position: 'relative', pt: 2, pb: 2 }}
      >
        <Box sx={{
          backgroundColor: 'black', height: '1px', width: '100%',
          position: 'absolute', top: '23px', zIndex: '-1'
        }} />
        <Box sx={{
          pr: 2, pl: 2, margin: 'auto', width: 'fit-content',
          backgroundColor: 'white', zIndex: 1
        }}>
          {categoryName}
        </Box>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {recipes.length === 0 ? (
          <Typography variant="h6" align="center">
            אין מתכונים בקטגוריה זו
          </Typography>
        ) : (
          recipes.map(recipe => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: 'none' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:3000${recipe.image}`}
                    alt={recipe.name}
                  />
                  <CardContent sx={{ direction: 'rtl', color: "black" }}>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: "bold" }}>
                      {recipe.name}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      ⏳
                      <Typography variant="body2">{recipe.preparationTime} דקות</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      🍽
                      <Typography variant="body2">כמות: {recipe.finalYield}</Typography>
                    </Box>
                  </CardContent>
                </Link>

                {/* כפתור לייק */}
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    padding: '5px 10px',
                    borderRadius: '50px',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: '10px',
                    bottom: '10px',
                    color: 'black'
                  }}
                >
                  <CardActions>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(recipe);
                    }}>
                      <Typography variant="body2" sx={{ marginRight: '5px', color: 'black' }}>
                        {recipe.likes || 0}
                      </Typography>
                      {recipe.isLiked ? (
                        <ThumbUpIcon sx={{ color: 'black' }} />
                      ) : (
                        <ThumbUpOffAltIcon sx={{ color: 'black' }} />
                      )}
                    </Button>
                  </CardActions>
                </Box>

                {/* כפתורי מנהל */}
                {user && user.isAdmin && (
                  <Box sx={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 1 }}>
                    <Link to={`/update-recipe/${recipe._id}`}>
                      <IconButton sx={{ color: 'black' }}>
                        <EditIcon />
                      </IconButton>
                    </Link>

                    {/* כפתור מחיקה */}
                    <IconButton
                      sx={{ color: 'black' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecipe(recipe._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>


      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteRecipe}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ direction: 'rtl' }}
      >
        <DialogTitle id="alert-dialog-title">{"האם אתה בטוח שברצונך למחוק את המתכון?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            פעולה זו תסיר את המתכון לצמיתות. האם אתה בטוח שברצונך להמשיך?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteRecipe}>לא למחוק</Button>
          <Button onClick={confirmDeleteRecipe} autoFocus>
            למחוק
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryRecipe;
