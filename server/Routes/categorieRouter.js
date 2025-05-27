const express = require("express");
const categoriesController = require("../Controllers/categorieController");
const categoriesRouter = express.Router();

// מקבל את כל הקטגוריות
categoriesRouter.get("/", categoriesController.getAllCategories);

// מקבל קטגוריה לפי ID
categoriesRouter.get("/:id", categoriesController.getCategoryById);

// מוסיף קטגוריה חדשה
categoriesRouter.post("/",categoriesController.upload.single('image'),categoriesController.addCategory);

// מוחק קטגוריה לפי ID
categoriesRouter.delete("/:id", categoriesController.deleteCategory);

// מעדכן קטגוריה לפי ID
categoriesRouter.put("/:id", categoriesController.updateCategory);

module.exports = categoriesRouter;
