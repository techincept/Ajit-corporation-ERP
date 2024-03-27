const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Comisson = require("../models/comisson");
const { calculateComisson } = require("../utils/calculateComisson");

const createUser = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    mobile,
    email,
    role,
    party,
    password,
    percentage,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name: `${firstName.trim()} ${middleName.trim()} ${lastName.trim()}`,
      email,
      userName: `${email.split("@")[0]}`,
      role,
      party,
      password: hash,
      percentage,
      mobile,
    });
    return res.status(201).json({
      message: "User Created Successfully",
      userName: newUser.userName,
    });
  } catch (error) {
    console.log(error);
    return res.json({ error, message: "Error in User registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(404).json("fill the field");
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("user not found");
    const isMatch = await bcrypt.compare(password, user.password);
    // user.select("-password -email");
    if (!isMatch) return res.status(403).json("invalid credentials");
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ message: "Login Successfully", t: token, details: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in login");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json("error in getting all users");
  }
};

const getComission = async (req, res) => {
  try {
    const comissions = await Comisson.find({}).populate({
      path: "transaction",
      populate: ["paidTo", "sender"],
    });
    const total = comissions.reduce((acc, cur) => acc + cur.amount, 0);
    res.status(200).json({ comissions, total });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
module.exports = { createUser, login, getAllUsers, getComission };
