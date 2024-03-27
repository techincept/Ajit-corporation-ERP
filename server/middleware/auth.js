const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
require('dotenv').config();

const superAdminAuth = async(req,res,next)=>{
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if(!token){
            return res.status(404).json("Token not found");
        }
        const {id} = await jwt.verify(token,process.env.JWT_SECRET);
        const isSuperAdmin = await User.findById(id);
        if(isSuperAdmin.role != 'super') return res.status(403).json({message:"User not authorize"});
        req.user = id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in super admin auth");
    }
}

const adminAuth = async(req,res,next)=>{
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if(!token){
            return res.status(404).json({message:"Token not found"});
        }
        const {id} = await jwt.verify(token,process.env.JWT_SECRET);
        const isAdmin = await User.findById(id);
        if(isAdmin.role == 'employee') return res.status(403).json({message:"User is not authorize"});
        req.user = id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in admin auth");
    }
}

const employeeAuth = async(req,res,next)=>{
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if(!token) return res.status(404).json({message:"Token not found"});
        const {id} = await jwt.verify(token,process.env.JWT_SECRET);
        const isEmployee =  await User.findById(id);
        if(isEmployee.role != 'super' && isEmployee.role != 'admin' && isEmployee.role != 'employee'){
            return res.status(403).json({message:"User is not authorize"});
        }
        req.user = id;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in employee auth"});
    }
}

module.exports = {superAdminAuth,adminAuth,employeeAuth}