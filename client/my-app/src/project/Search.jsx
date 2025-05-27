import React, { useState, useEffect } from "react";
import axios from 'axios';
import { TextField, Box, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // כדי לאחסן את הערך שהוזן בשדה החיפוש
    const [filteredRecipes, setFilteredRecipes] = useState([]); // לאחסן את המתכונים המפולטרים לפי החיפוש
    const nav = useNavigate();

    useEffect(() => {
        const getAllRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/recipes'); // עדכון לכתובת API מתאימה
                console.log(response.data); // הדפסת הנתונים שמתקבלים
                setRecipes(response.data); // שים לב שמעדכנים את `recipes` עם הנתונים שהתקבלו מה-API
            } catch (err) {
                console.error(err);
            }
        };
        getAllRecipes();
    }, []); // ריצה פעם אחת כשמרכיב `Search` נטען

    // פונקציה שמטפלת בחיפוש ומסננת את המתכונים
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query); // עדכון ה-state של החיפוש
        if (query === "") {
            setFilteredRecipes([]); // אם החיפוש ריק, לא מחזירים את כל המתכונים
        } else {
            const filtered = recipes.filter(recipe => {
                // לוודא ששם המתכון קיים ושזהו מיתר נתונים תקין לפני שימוש ב-`toLowerCase`
                return recipe && recipe.name && typeof recipe.name === 'string' && recipe.name.toLowerCase().includes(query.toLowerCase());
            });
            setFilteredRecipes(filtered); // עדכון המתכונים המפולטרים
        }
    };

    // פונקציה עבור ניווט למתכון ושטיפת שדה החיפוש
    const handleRecipeClick = (recipeId) => {
        nav("/recipe/" + recipeId); // ניווט לעמוד המתכון
        setSearchQuery(''); // מנקה את שדה החיפוש לאחר הניווט
        setFilteredRecipes([]); // מאפס את המתכונים המפולטרים
    };

    return (
        <Box sx={{ position: 'relative', top: '9px', direction: 'rtl', left: '63px' }}>
            {/* שדה חיפוש */}
            <TextField
                label="חפש מתכון...  "
                variant="outlined"
                value={searchQuery} // שמירה על ערך ה-input
                onChange={handleSearchChange} // קריאה לפונקציה כל פעם שהמשתמש מקליד
                fullWidth
                sx={{
                    marginBottom: 2,
                    borderRadius: '15px',  // פינות מעוגלות
                    backgroundColor: 'transparent', // רקע שקוף
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'black', // צבע גבול לבן
                        },
                        '&:hover fieldset': {
                            borderColor: 'black', // צבע גבול בלחיצה
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'black', // צבע התווית לבן
                    },
                    '& .MuiInputBase-input': {
                        color: 'black', // צבע הטקסט לבן
                    },
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // צל מקוקוו
                }} // הסטיילינג ל-TextField
            />

            {/* תוצאה של חיפוש - הצגת תוצאה רק אם יש חיפוש */}
            {searchQuery && (
                <Box sx={{
                    color: "black",
                    position: 'absolute',
                    backgroundColor: 'white',
                    width: '100%',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '8px',
                    boxShadow: 2
                }}>
                    {filteredRecipes.length === 0 ? (
                        <Typography variant="body2" sx={{ fontSize: '10px' }}>לא נמצאו מתכונים תואמים.</Typography>
                    ) : (
                        filteredRecipes.map((recipe) => (
                            <Card key={recipe._id} sx={{ marginBottom: 2 }} >
                                <CardContent onClick={() => handleRecipeClick(recipe._id)}>
                                    <Typography variant="body1" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                        {recipe.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '10px' }}>
                                        {recipe.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Search;
