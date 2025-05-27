const Categories = require("../Models/categorieModel");
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// הגדרת תיקיית יעד להעלאת קבצים
const uploadDir = './uploads';

// אם התיקיה לא קיימת, ניצור אותה
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// הגדרת Multer לאחסון הקובץ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // התמונה תישמר בתיקיית uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

// מקבל את כל הקטגוריות
const getAllCategories = (req, res) => {
  Categories.find()
    .then(result => res.send(result))
    .catch(err => res.status(400).send({"Error":err}));
};

// מקבל קטגוריה לפי ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res.status(400).send("Category not found");
    }
    res.send(category);
  } catch (err) {
    res.status(500).send({"Error": err});
  }
};

// מוסיף קטגוריה חדשה
// const addCategory = async (req, res) => {
//   try {
//     const {name ,image} = req.body;
//     console.log(name);
//     //נאלי יש בעיה הוא לא קוט את התמונה
//     const newCategory = new Categories({name:name, image:req.file.fileName});
//     console.log(newCategory);
//     await newCategory.save();
//     res.send({"Category added successfully": newCategory});
//   } catch (err) {
//     res.status(500).send({"Error":err});
//   }
// };

const addCategory = async (req, res) => {
  try {
    console.log("File received:", req.file);
    if (!req.file) {
      return res.status(400).send({ error: "Image is required" });
    }

    // חילוץ השדה name מהגוף
    const { name } = req.body;

    // שמירת נתיב התמונה
    const imagePath = `/uploads/${req.file.filename}`;

    // יצירת קטגוריה חדשה עם הנתונים שהתקבלו
    const newCategory = new Categories({
      name: name,
      image: imagePath
    });
console.log('new category',newCategory);

    await newCategory.save();
    res.status(201).send({ message: "Category added successfully", category: newCategory });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// מוחק קטגוריה לפי ID
const deleteCategory = (req, res) => {
  Categories.findByIdAndDelete(req.params.id)
    .then(category => {
      if (category) {
        res.send({"Category deleted":category});
      } else {
        res.status(400).send("Category not found");
      }
    })
    .catch(err => res.status(500).send({"Error": err}));
};

// מעדכן קטגוריה
const updateCategory = async (req, res) => {
  try {
    const selectedCategory = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!selectedCategory) {
      return res.status(400).send("Category not found");
    }
    res.send(selectedCategory);
  } catch (err) {
    res.status(500).send({"Error":err});
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
  upload
};
