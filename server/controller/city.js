const City = require("../model/city.js");
const { cityValidator } = require("../validators/city.js");

const createCity = async (req, res) => {
  try {
    const {success} = cityValidator.safeParse(req.body);
    if(!success) return res.status(411).json({message:"Not Valid data"});
    const { city } = req.body;
    const newCity = await City.create({ city });
    res.status(201).json({ newCity });
  } catch (error) {
    console.log("Error in City creation");
    return res.status(500).json({ message: "Error in City creation", error });
  }
};

const readCity = async (req, res) => {
  try {
    const cities = await City.find({});
    res.status(201).json({ cities });
  } catch (error) {
    console.log("Error in City creation");
    return res.status(500).json({ message: "Error in City creation", error });
  }
};

const updateCity = async (req, res) => {
  try {
    const {success} = cityValidator.safeParse(req.body);
    if(!success) return res.status(411).json({message:"Not Valid data"});
    const {id,city} = req.body;
    const cities = await City.findByIdAndUpdate(id,{city});
    res.status(201).json({ cities });
  } catch (error) {
    console.log("Error in City creation");
    return res.status(500).json({ message: "Error in City creation", error });
  }
};

// const deleteCity = async(req,res)=>{
//   try {
//     // const 
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({message:"Error in delete city",error})
//   }
// }

module.exports = {createCity,readCity,updateCity}
