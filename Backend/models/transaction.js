const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    amount: { type: Number, required: true },
    biltyNumber: { type: String, required: true },
    city: { type: String, required: true },
    comisionTypeP: { type: String, required: true },
    comisionTypeS: { type: String, required: true },
    date: { type: Date, default: Date.now },
    netComision: { type: Number, required: true },
    netPaidAmount: { type: Number, required: true },
    paidTo: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    receivedBy: { type: String, required: true },
    receiverCommission: { type: Number, default: 0 },
    receiverCommissionPercentage: { type: Number, default: 0 },
    receiverName: { type: String, required: true },
    receiverNumber: { type: Number, required: true },
    senderCommission: { type: Number, required: true },
    senderCommissionPercentage: { type: Number, required: true },
    netReceivedAmount: { type: Number, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    senderNumber: { type: Number, required: true },
    voucherNumber: { type: String, required: true },
    postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sCurrentBalance: Number,
    rCurrentBalance: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
