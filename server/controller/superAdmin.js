const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const { userValidator } = require("../validators/user.js");

const createAdmin = async (req, res) => {
  const { name, mobile, email, role, password } = req.body;
  try {
    const { success } = userValidator.safeParse(req.body);
    if (!success) return res.status(411).json({ message: "Invalid data type" });

    const isUser = await User.findOne({ email });

    if (isUser)
      return res.status(409).json({ message: "Email is already used" });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      userName: `${email.split("@")[0]}`,
      role,
      password: hash,
      mobile,
      createdBy: req.user,
    });
    return res.status(201).json({
      message: `${role.toUpperCase()} Created Successfully`,
      credentials: { userName: newUser.email, password },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in User creation", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find({_id:{$ne:req.user}});
    return res.status(200).json(allUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in getting all users",
    });
  }
};

module.exports = { createAdmin, getAllUsers };
