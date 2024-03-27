const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user.js");

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Db Connected");
    const isAdmin = await User.find({ role: "Admin" });
    if (isAdmin.length < 1) {
      const salt = await bcrypt.genSalt(10);
      // const hash = await bcrypt.hash(process.env.ADMIN_PASS, salt);
      const hash = await bcrypt.hash("123456789", salt);
      const Admin = await User.create({
        name: "Admin Dev",
        userName: "admin@techIncept",
        // name: process.env.ADMIN_NAME,
        // userName: process.env.USER_NAME,
        // mobile: process.env.MOBILE,
        // email: process.env.EMAIL,
        mobile: "1234567890",
        email: "admin@techIncept.com",
        role: "Admin",
        party: "HO",
        commission: 0,
        password: hash,
      });
      console.log(`ADMIN Created userName:${Admin.userName}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
