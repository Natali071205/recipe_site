const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
 
  
  // שם קטגוריה, שדה חובה וצריך להיות בטווח אורך מתאים
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "שם הקטגוריה חייב להיות באורך מינימלי של 3 תוים"],
    maxlength: [50, "שם הקטגוריה יכול להיות באורך מקסימלי של 50 תוים"]
  },
  
  image: {
    type: String,
    required: true,
  },

});

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
