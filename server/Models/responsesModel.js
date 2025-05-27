const mongoose = require("mongoose");


const responseSchema = new mongoose.Schema({
  
  // קוד משתמש - קשר למשתמשים, שדה חובה
  userCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  recipeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipes',
    required: true
  },

  // תוכן התגובה - שדה חובה, צריך להיות תו אחד לפחות
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "תוכן התגובה חייב להיות לפחות תו אחד"],
    maxlength: [1000, "תוכן התגובה יכול להיות באורך מקסימלי של 1000 תוים"]
  },

  // תאריך פרסום התגובה
  publishDate: {
    type: Date,
    default: Date.now,
  }

  
});

// יצירת מודל מהסכמה
const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
