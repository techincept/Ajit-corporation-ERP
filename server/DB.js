const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require('./model/user.js');

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Db Connected");
    const isSuperAdmin = await User.find({ role: "super" });
    if (isSuperAdmin.length < 1) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("123456789", salt);
      const superAdmin = await User.create({
        name: "Super Admin Dev",
        userName: "superadmin@techIncept",
        mobile: "1234567890",
        email: "superadmin@techIncept.com",
        role: "super",
        password: hash,
      });
      console.log(`SUPER ADMIN Created userName:${superAdmin.userName}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
