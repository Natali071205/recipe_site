const express = require("express");
const recipesController = require("../Controllers/recipeController");
const recipesRouter = express.Router();

// מקבל את כל המתכונים
recipesRouter.get("/", recipesController.getAllRecipes);
recipesRouter.get('/recipesPopular',recipesController.getPopularRecipes)
recipesRouter.get('/recipes4Popular/:categoryId',recipesController.getPopular4Recipes)


// מקבל מתכון לפי ID
recipesRouter.get("/:id", recipesController.getRecipeById);
recipesRouter.get('/category/:categoryId',recipesController.getRecipeByCategoryId)


// מוסיף מתכון חדש
recipesRouter.post("/",recipesController.upload.single('image'), recipesController.addRecipe);

// מוחק מתכון לפי ID
recipesRouter.delete("/:id", recipesController.deleteRecipe);

// מעדכן מתכון לפי ID
recipesRouter.put("/:id",recipesController.upload.single('image'), recipesController.updateRecipe);

module.exports = recipesRouter;
