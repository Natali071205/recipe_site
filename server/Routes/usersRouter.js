const express = require("express");
const usersController = require("../Controllers/userController");
const usersRouter = express.Router();

// מקבל את כל המשתמשים
usersRouter.get("/", usersController.getAllUsers);

// מקבל משתמש לפי ID
usersRouter.get("/:id", usersController.getUserById);

// מוסיף משתמש חדש
usersRouter.post("/", usersController.addUser);
usersRouter.post("/login", usersController.login);
usersRouter.post("/signup", usersController.signup);



// usersRouter.post("/sign-up", usersController.addUser);



// מוחק משתמש לפי ID
usersRouter.delete("/:id", usersController.deleteUser);

// מעדכן משתמש לפי ID
usersRouter.put("/:id", usersController.updateUser);

module.exports = usersRouter;
