import React from "react";
import NavBar from './NavBar';
import Home from './Home';
import About from './About';
import LogIn from './user/LogIn';
import UpdateUser from "./UpdateUser";
import SingUp from './user/SingUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddRecipeMeneger from "./manager/AddRecipeMeneger";
import CategoryRecipe from "./CategoryRecipe";
import AddCategoryManager from "./manager/AddCategoryManager";
import Search from "./Search";
import RecipeData from "./RecipeData";
import UpdateRecipeManager from "./UpdateRecipeManager"


export default function RoutesComponent() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/AddRecipeMeneger" element={<AddRecipeMeneger />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/UpdateUser" element={<UpdateUser />} />  
        <Route path="/signup" element={<SingUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/category-recipe" element={<CategoryRecipe />} />
        <Route path="/AddCategoryManager" element={<AddCategoryManager />} />
        <Route path="/recipe/:id" element={<RecipeData />} /> 
        <Route path="/updateRecipe/:recipeId" element={<UpdateRecipeManager />} />

      </Routes>
    </BrowserRouter>
  );
}
