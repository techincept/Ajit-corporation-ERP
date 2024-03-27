const Group = require("../model/group.js");
const { groupValidation } = require("../validators/group.js");

const createGroup = async(req,res)=>{
    try {
        const {success} = groupValidation.safeParse(req.body);
        if(!success) return res.status(411).json({message:"Invalid Data"});
        const {name} = req.body;
        const newGroup = await Group.create({name});
        res.status(201).json({message:"Group Created Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in group creation",error});
    }
}

const readGroup = async(req,res)=>{
    try {
       const groups = await Group.find({});
       res.status(200).json(groups);  
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in group reading"});
    }
}

module.exports = {readGroup,createGroup}