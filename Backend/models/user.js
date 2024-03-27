const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  party: { type: String, required: true },
  password: { type: String, required: true },
  percentage: { type: Number },
  commission: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
