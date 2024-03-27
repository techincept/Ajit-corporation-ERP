const mongoose = require("mongoose");

// Schema for Cashbook transaction
const cashbookSchema = mongoose.Schema({
  cashbook: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
  party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  narration: { type: String },
  date: { type: String, default: Date.now },
  voucherNumber: { type: String, required: true },
  postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentBalance: { type: Number },
});

module.exports = mongoose.model("Cashbook", cashbookSchema);
