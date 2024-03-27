const mongoose = require("mongoose");

const citySchema = mongoose.Schema(
  {
    city: { type: String, required: true ,unique:true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", citySchema);