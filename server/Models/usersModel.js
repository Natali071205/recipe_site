const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");  // לדחיסת סיסמאות (אם אתה רוצה)

const usersSchema = new mongoose.Schema({
  
  // שם משתמש, חובה להיות ייחודי
  username: {
    type: String,
    required: true,
    // trim: true,
    minlength: [3, "שם המשתמש חייב להיות באורך מינימלי של 3 תוים"],
    maxlength: [20, "שם המשתמש יכול להיות באורך מקסימלי של 20 תוים"]
  },
  
  // סיסמה, חובה שיהיה אורך מינימלי של 6 תוים
  password: {
    type: String,
    required: true,
    minlength: [6, "הסיסמה חייבת להיות באורך מינימלי של 6 תוים"],
  },
  
  // סוג משתמש (מנהלים או לא), ברירת מחדל היא false
  isAdmin: {
    type: Boolean,
    default: false,
  },
  
  // כתובת מייל, צריך להיות בפורמט תקני
  email: {
    type: String,
    required: true,
    lowercase: true, // הופך לאותיות קטנות
    // trim: true,
    match: [/^\S+@\S+\.\S+$/, "כתובת המייל לא תקינה"]
  }
});

// אכפתיות של הסיסמה, אם הוספת את bcrypt לדחיסת סיסמאות
// usersSchema.pre("save", async function(next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10); // 10 זה מספר הסיבובים
//   }
//   next();
// });

// יצירת מודל מהסכמה
const Users = mongoose.model("Users", usersSchema);

module.exports = Users;

