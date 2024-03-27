const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    // Sender
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    amount: { type: Number, required: true },
    receiverCommission: { type: Number, default: 0 },
    receiverCommissionPercentage: { type: Number, default: 0 },
    netPaidAmount: { type: Number, required: true },
    comisionTypeP: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverNumber: { type: Number, required: true },
    biltyNumber: { type: String, required: true ,unique:true},
    senderCommission: { type: Number, required: true },
    senderCommissionPercentage: { type: Number, required: true },
    netReceivedAmount: { type: Number, required: true },
    comisionTypeS: { type: String, required: true },
    receivedBy: { type: String, required: true },
    // Receiver
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    senderNumber: { type: Number, required: true },
    city: { type: mongoose.Schema.Types.ObjectId,ref:"City", required: true },
    netComision: { type: Number, required: true },
    voucherNumber: { type: String, required: true },
    postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sCurrentBalance: Number,
    rCurrentBalance: Number,
    company : {type:mongoose.Schema.Types.ObjectId,ref:'User'}
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
