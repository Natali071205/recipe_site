const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")

const usersRouter = require('./Routes/usersRouter');
const categoriesRouter = require('./Routes/categorieRouter');
const recipesRouter = require('./Routes/recipeRouter');
const responsesRouter = require('./Routes/responsesRouter');

const app = express();

// mongoose.connect('mongodb+srv://NataliUser:natali071205@cluster0.y68xpbl.mongodb.net/recipes?retryWrites=true&w=majority')
//   .then(() => {
//     console.log('✅ Successfully connected to MongoDB Atlas!');
//   })
//   .catch((err) => {
//     console.error('❌ Error connecting to MongoDB Atlas:', err);
//   });


mongoose.connect('mongodb://localhost:27017/recipes')
  .then(() => {
    console.log('successfuly to connent DB!');
  })
  .catch((err) => {
    console.error('Error not succesed to connect DB!', err);
  })

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/recipes', recipesRouter);
app.use('/response', responsesRouter);

// פועל רק אם השרת רץ בהצלחה
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});