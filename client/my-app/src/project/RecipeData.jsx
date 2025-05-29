import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, CardMedia, Paper,
  List, ListItem, ListItemText, TextField, IconButton,
  Grid, Divider, Card, CardContent, CardActionArea, Avatar
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PrintIcon from '@mui/icons-material/Print';
import { UserContext } from './Context';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom'; // הוסיפי בראש הקובץ

 // בתוך הקומפוננטה


const RecipeData = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [rsponse, setRsponse] = useState([]);
  const [newResponse, setNewResponse] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const { user } = useContext(UserContext);
  console.log(user,'in recipe');
  
 const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeResponse = await axios.get(`http://localhost:3000/recipes/${id}`);
        setRecipe(recipeResponse.data);
        document.title = recipeResponse.data.name;

        const categoryId = recipeResponse.data?.categoryCode?._id;
        if (!categoryId) return;

        const popularRecipesResponse = await axios.get(`http://localhost:3000/recipes/recipes4Popular/${categoryId}`);
        setRelatedRecipes(popularRecipesResponse.data);

        const responses = await axios.get(`http://localhost:3000/response/${id}`);
        setRsponse(responses.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const addResponse = () => {
    if (!newResponse.trim()) return;
    const responseData = {
      userCode: user._id,
      content: newResponse,
      recipeId: id,
      publishDate: new Date()
    };

    axios.post(`http://localhost:3000/response`, responseData)
      .then(response => {
        setRsponse(prev => [...prev, response.data]);
        setNewResponse('');
        setShowInput(false);
      })
      .catch(err => console.error(err));
  };

  const startEditing = (response) => {
    setEditingId(response._id);
    setEditedContent(response.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedContent('');
  };

  const saveEdit = async () => {
    if (!editedContent.trim()) return;
    try {
      await axios.put(`http://localhost:3000/response/${editingId}`, { content: editedContent });
      setRsponse((prevResponses) =>
        prevResponses.map((r) =>
          r._id === editingId ? { ...r, content: editedContent } : r
        )
      );
      cancelEditing();
    } catch (error) {
      console.error("שגיאה בעדכון תגובה:", error);
    }
  };

  const handlePrint = () => {
    const input = document.getElementById('recipe-section');
    html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${recipe.name}.pdf`);
    }).catch(error => {
      console.error('שגיאה בעת יצירת PDF:', error);
    });
  };

  if (!recipe) return <div>מתכון לא נטען...</div>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, pt: 4, marginTop: "55px" }}>
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        <Grid item xs={12} md={4} >
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ display: "flex", justifyContent: "center", fontWeight: "bold" }} gutterBottom>
              עוד מתכונים דומים
            </Typography>
            <Grid container spacing={2}>
              {relatedRecipes.map((item) => (
                <Grid item xs={12} sm={6} key={item._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <CardActionArea href={`/recipe/${item._id}`}>
                      <CardMedia
                        component="img"
                        image={`http://localhost:3000${item.image}`}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12
                        }}
                      />
                      <CardContent sx={{ bgcolor: '#f9fafb', textAlign: 'center', py: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="bold" noWrap>
                          {item.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>


          <Paper elevation={4} sx={{ mt: 4, p: 3, borderRadius: 4, bgcolor: '#f9fafb' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#333">
                תגובות על המתכון
              </Typography>
              <Box sx={{ mt: 1, width: '100%', height: '4px', bgcolor: '#f5f1e6', borderRadius: '2px' }} />
            </Box>

            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mt: 2 }}>
              <List>
                {rsponse.length > 0 ? rsponse.map((response) => (
                  <ListItem key={response._id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#f5f1e6',
                        borderRadius: '20px',
                        p: 2,
                        maxWidth: '90%',
                        width: '100%',
                        boxShadow: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                          sx={{ width: 36, height: 36, mr: 2 }}
                          src={`http://localhost:3000${response?.userCode?.avatar}`}
                        />
                        {editingId === response._id ? (
                          <TextField
                            fullWidth
                            multiline
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            sx={{ backgroundColor: 'white', borderRadius: 1 }}
                          />
                        ) : (
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                              {response.content}
                            </Typography>
                            {user?._id === response.userCode._id && (
                              <Typography
                                variant="caption"
                                sx={{ color: 'black', cursor: 'pointer', mt: 0.5 }}
                                onClick={() => startEditing(response)}
                              >
                                עריכה
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>

                      {editingId === response._id && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignSelf: 'flex-end' }}>
                          <Typography
                            variant="body2"
                            onClick={saveEdit}
                            sx={{
                              color: 'black',
                              border: '1px solid black',
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: '0.3s',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                              },
                            }}
                          >
                            אישור
                          </Typography>
                          <Typography
                            variant="body2"
                            onClick={cancelEditing}
                            sx={{
                              color: 'black',
                              border: '1px solid black',
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              cursor: 'pointer',
                              transition: '0.3s',
                              '&:hover': {
                                bgcolor: '#f5f5f5',
                              },
                            }}
                          >
                            ביטול
                          </Typography>
                        </Box>
                      )}

                    </Box>

                    <Typography variant="caption" sx={{ mt: 1, color: 'gray' }}>
                      מאת: {response?.userCode?.username || 'אנונימי'} |{' '}
                      {new Date(response.publishDate).toLocaleDateString('he-IL')}
                    </Typography>
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText primary="אין תגובות עדיין" />
                  </ListItem>
                )}
              </List>
            </Box>

            {user && (
              <Box sx={{ mt: 2 }}>
                {showInput && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="הוסף תגובה"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton sx={{ bgcolor: '#dc4337', color: 'white', '&:hover': { bgcolor: '#f7c1bd' } }} onClick={() => setShowInput(!showInput)}>
                    <BorderColorIcon />
                  </IconButton>
                  {showInput && (
                    <IconButton sx={{ bgcolor: '#dc4337', color: 'white', '&:hover': { bgcolor: '#f7c1bd' } }} onClick={addResponse}>
                      <Typography>שלח</Typography>
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>


        <Grid item xs={12} md={8}>
          <Box id="recipe-section">
            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:3000${recipe.image}`}
                alt={recipe.name}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
              />
              <CardContent sx={{ direction: 'rtl' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" fontWeight="bold">{recipe.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handlePrint}>
                      <PrintIcon sx={{ color: 'black' }} />
                    </IconButton>
                    {user?.isAdmin && (
                      <Box
                        onClick={() => navigate(`/updateRecipe/${recipe._id}`)}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 1,
                          bgcolor: 'black',
                          color: 'white',
                          borderRadius: 2,
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: '#333',
                          },
                        }}
                      >
                        עריכת מתכון
                      </Box>
                    )}
                  </Box>
                </Box>


                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight="bold" fontSize="1.6rem">
                  מצרכים
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem sx={{ textAlign: 'start' }} key={index} disablePadding>
                      - <ListItemText primary={ingredient} primaryTypographyProps={{ fontSize: '1.2rem' }} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" fontWeight="bold" fontSize="1.6rem">אופן ההכנה</Typography>
                <List>
                  {recipe.preparationSteps.map((step, index) => (
                    <ListItem sx={{ textAlign: 'start' }} key={index}>
                      <ListItemText primary={`${index + 1}. ${step}`} primaryTypographyProps={{ fontSize: '1.2rem' }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeData;
