const Transaction = require("../models/transaction.js");

const updateTransactionAfter = async (date, paidTo, sender,netPaidAmount,netReceivedAmount) => {
    // paidTo=> sender sender=>receiver
  await Transaction.updateMany(
    { $and:[{date:{ $gt: date }},{paidTo}] },
    {
      $inc: {
        sCurrentBalance: -netPaidAmount,
      },
    }
  );
  await Transaction.updateMany(
    { $and:[{date:{ $gt: date }},{sender:paidTo}] },
    {
      $inc: {
        rCurrentBalance: -netPaidAmount,
      },
    }
  );
  await Transaction.updateMany(
    { $and:[{date:{ $gt: date }},{paidTo:sender}] },
    {
      $inc: {
        sCurrentBalance: netReceivedAmount,
      },
    }
  );
  await Transaction.updateMany(
    { $and:[{date:{ $gt: date }},{sender}] },
    {
      $inc: {
        rCurrentBalance: netReceivedAmount,
      },
    }
  );
};

module.exports = { updateTransactionAfter };
