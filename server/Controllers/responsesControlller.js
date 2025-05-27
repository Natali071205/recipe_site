const Responses = require("../models/responsesModel");

// מקבל את כל התגובות
const getAllResponses = (req, res) => {
  console.log('9999999');
  
  Responses.find()
    .populate("userCode") // מחבר את המשתמש
    .then(result => res.send(result))
    .catch(err => res.status(400).send("Error", err));
};

// מקבל תגובה לפי ID
const getResponseById = async (req, res) => {
  try {
    const response = await Responses.find({recipeId:req.params.recipeId}).populate("userCode").populate("recipeId");
    if (!response) {
      return res.status(400).send("Response not found");
    }
    res.send(response);
  } catch (err) {
    res.status(500).send("Error", err);
  }
};

// מוסיף תגובה חדשה
const addResponse = async (req, res) => {
  try {
    console.log(req.body);  
    const { userCode, content } = req.body;
    let newResponse = new Responses( req.body);
    console.log('new',newResponse);
    await newResponse.save();
    res.send(await newResponse.populate("userCode"));
  } catch (err) {
    res.status(500).send({"Error": err});
  }
};

// מוחק תגובה לפי ID
const deleteResponse = (req, res) => {
  Responses.findByIdAndDelete(req.params.id)
    .then(response => {
      if (response) {
        res.send("Response deleted", response);
      } else {
        res.status(400).send("Response not found");
      }
    })
    .catch(err => res.status(500).send("Error", err));
};

// מעדכן תגובה
const updateResponse = async (req, res) => {
  try {
    const selectedResponse = await Responses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!selectedResponse) {
      return res.status(400).send("Response not found");
    }
    res.send(selectedResponse);
  } catch (err) {
    res.status(500).send("Error", err);
  }
};

module.exports = {
  getAllResponses,
  getResponseById,
  addResponse,
  deleteResponse,
  updateResponse,
};
