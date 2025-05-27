const express = require("express");
const responsesController = require("../Controllers/responsesControlller");
const responsesRouter = express.Router();

// מקבל את כל התגובות
responsesRouter.get("/", responsesController.getAllResponses);

// מקבל תגובה לפי ID
responsesRouter.get("/:recipeId", responsesController.getResponseById);

// מוסיף תגובה חדשה
responsesRouter.post("/", responsesController.addResponse);

// מוחק תגובה לפי ID
responsesRouter.delete("/:id", responsesController.deleteResponse);

// מעדכן תגובה לפי ID
responsesRouter.put("/:id", responsesController.updateResponse);

module.exports = responsesRouter;
