const mongoose = require("mongoose");

const partySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    openingBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    currentBalance: { type: Number, required: true },
    dailyOpeningBalance: Number,
    type: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Party", partySchema);
