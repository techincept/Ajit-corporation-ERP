const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginValidator } = require("../validators/user");

const login = async(req,res)=>{
try {
   const {email,password} = req.body;
   const {success} = loginValidator.safeParse(req.body);
   if(!success) return res.status(411).json({message:"Not valid data for login"});
   const user = await User.findOne({email});
   if(!user) return res.status(403).json({message:"invalid credentials"});
   const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch) return res.status(403).json({message:"invalid credentials"});
   const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
   return res
     .status(200)
     .json({ message: "Login Successfully", t: token, details: user });
} catch (error) {
    console.log(error);
    return res.status(500).json({message:"Error in Login",error})
}
}

module.exports = {login}

