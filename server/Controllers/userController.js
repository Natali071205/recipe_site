const Users = require("../models/usersModel");


const getAllUsers = (req, res) => {
  Users.find()
    .then(result => res.send(result))
    .catch(err => res.status(400).send("Error", err));
};

const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Error", err);
  }
};


const addUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new Users({ username, password, email, isAdmin: false });
    await newUser.save();
    res.send({ "User added successfully": newUser });
  } catch (err) {
    res.status(500).send({ "Error": err });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username: username, password: password });
    if (!user) {
      return res.status(404).send({ message: "User not found" });  
    }
    return res.status(200).send(user); 
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error", error: err });
  }
};

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await Users.findOne({ username: username, password: password });
    if (!user) {
      const newUser = new Users({ username: username, password: password, email: email }) 
      await newUser.save();
      return res.send({ newUser})
    }
    return res.status(400).send({"user already exist":user});  
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error", error: err });
  }

}

const deleteUser = (req, res) => {
  Users.findByIdAndDelete(req.params.id)
    .then(user => {
      if (user) {
        res.send("User deleted", user);
      } else {
        res.status(400).send("User not found");
      }
    })
    .catch(err => res.status(500).send("Error", err));
};


const updateUser = async (req, res) => {
  try {
    const selectedUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!selectedUser) {
      return res.status(400).send("User not found");
    }
    res.send(selectedUser);
  } catch (err) {
    res.status(500).send("Error", err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  login,
  deleteUser,
  updateUser,
  signup
};
