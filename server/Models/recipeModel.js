const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  // תמונה של המתכון, שמירה כ-URL (כמובן אפשר לשנות לסוג אחר אם יש צורך)
  image: {
    type: String,
    // required: true,
  },
  name:{
    type:String
  },
  // תאריך פרסום המתכון
  publishDate: {
    type: Date,
    default: Date.now,
  },
  
  // קוד קטגוריה - קשר לקטגוריות, שדה חובה וצריך להיות קיים במסד
  categoryCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    required: true,
  },
  
  // משך זמן הכנה (במינוטים)
  preparationTime: {
    type: Number,
    // required: true,
    min: [1, "משך זמן ההכנה חייב להיות לפחות 1 דקה"],
  },
  ingredients:{
    type:[String]
  },
  
  preparationSteps:{
    type:[String]
  },
  
  // כמות תוצאה סופית (למשל, מספר מנות)
  finalYield: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "כמות התוצאה הסופית חייבת להיות לפחות תו אחד"]
  },

  likes:{
 type:Number
  }
});

// יצירת מודל מהסכמה
const Recipes = mongoose.model("Recipes", recipeSchema);

module.exports = Recipes;