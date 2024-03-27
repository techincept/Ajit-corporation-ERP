const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
require("dotenv").config();

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(404).json("Token not found");
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const isAdmin = await User.findById(id);
    if (isAdmin.role != "Admin") return res.status(403).json("Not Authorize");
    req.user = id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in admin auth");
  }
};

module.exports = { adminAuth };
