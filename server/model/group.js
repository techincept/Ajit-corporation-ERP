const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
