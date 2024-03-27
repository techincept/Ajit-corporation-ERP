const bcrypt = require('bcrypt');
const User = require('../model/user.js');
const { userValidator } = require('../validators/user.js');
const Comission = require('../model/comission.js');

const createEmployee = async(req,res)=>{
    const {name,mobile,email,role,password} = req.body
    try {
        const {success} = userValidator.safeParse(req.body)
        if(!success) return res.status(411).json({message:'Invalid data type'})

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        const newUser = await User.create({
            name,
            email,
            userName:`${email.split('@')[0]}`,
            role,
            password: hash,
            mobile,
            createdBy:req.user
        });
        return res.status(201).json({
            message:`${role.toUpperCase()} Created Successfully`,
            userName:newUser.userName
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in User Creation"});
    }
}

const getAllUsers = async(req,res)=>{
    try {
        const allUser = await User.find({$and:[{type:{$not:{$regex:"super"}}},{createdBy:req.user}]});
        return res.status(200).json(allUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in getting all Users"});
    }
}

const getComission = async(req,res)=>{
    try {
        const user = await User.findById(req.user);
        if(user.role == 'super') return res.status(403).json({message:"Access denied"});
        const id = (user.role == 'company') ? user._id : user.createdBy;
        const comissions = await Comission.find({company:id}).populate({
            path:'transaction',
            populate:["sender","receiver"]
        });
        const total = comissions.reduce((acc,cur)=>acc+cur.amount,0);
        res.status(200).json({comissions,total});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

module.exports = {createEmployee,getAllUsers,getComission}