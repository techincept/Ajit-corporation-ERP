const Cashbook = require("../models/cashBook.js");
const Transaction = require("../models/transaction.js");
const Party = require("../models/party.js");
const User = require("../models/user.js");
const Comission = require("../models/comisson.js");
const { updateTransactionAfter } = require("../utils/transactionUpdater.js");

const create = async (req, res) => {
  try {
    const {
      date,
      paidTo,
      amount,
      receiverCommission,
      receiverCommissionPercentage,
      netPaidAmount,
      comisionTypeP,
      receiverName,
      receiverNumber,
      biltyNumber,
      senderCommission,
      senderCommissionPercentage,
      netReceivedAmount,
      comisionTypeS,
      receivedBy,
      sender,
      senderNumber,
      city,
      netComision,
    } = req.body;

    // return
    /*if (
      !date ||
      !paidTo ||
      !amount ||
      !comisionTypeP ||
      !receiverName ||
      !receiverNumber ||
      !biltyNumber ||
      !comisionTypeS ||
      !receivedBy ||
      !sender ||
      !senderNumber ||
      !city
    )
      return res.status(411).json("Invalid Input"); */
    const sentBy = await Party.findById(paidTo);
    const receiver = await Party.findById(sender);
    const cashbookCount = await Cashbook.countDocuments({});
    const transactionCount = await Transaction.countDocuments({});

    const lastTransactionR = await Transaction.find({
      $and: [
        { date: { $lte: date } },
        { $or: [{ sender },{paidTo:sender}] },
      ],
    }).sort({ date: 1 });

    
    const lastTransactionS = await Transaction.find({
      $and: [
        { date: { $lte: date } },
        { $or: [{ paidTo }, {sender:paidTo }] },
      ],
    }).sort({ date: 1 });
    
    if (!receiver || !sentBy) return res.status(404).json("Party not found");
    // console.log(lastTransactionR,lastTransactionS);
    

    // Managing opening balance
    receiver.currentBalance = receiver.currentBalance + netReceivedAmount;
    sentBy.currentBalance = sentBy.currentBalance - netPaidAmount;
    //Saving current balance changes
    await sentBy.save();
    await receiver.save();

    let newTransaction;

    // Checking for Previous transaction
    if (lastTransactionS.length == 0 && lastTransactionR.length == 0) {
      const newSCurrentBalance =
        sentBy.type == "credit"
          ? sentBy.openingBalance
          : -1 * sentBy.openingBalance;
      const newRCurrentBalance =
        receiver.type == "credit"
          ? receiver.openingBalance
          : -1 * receiver.openingBalance;
      // Transaction Creation
      newTransaction = await Transaction.create({
        date,
        paidTo,
        amount,
        receiverCommission,
        receiverCommissionPercentage,
        netPaidAmount,
        comisionTypeP,
        receiverName,
        receiverNumber,
        biltyNumber,
        senderCommission,
        senderCommissionPercentage,
        netReceivedAmount,
        comisionTypeS,
        receivedBy,
        sender,
        senderNumber,
        city,
        netComision,
        voucherNumber: "T" + (cashbookCount + transactionCount + 1),
        rCurrentBalance: newRCurrentBalance + netReceivedAmount,
        sCurrentBalance: newSCurrentBalance - netPaidAmount,
        postBy: req.user,
      });
      
      updateTransactionAfter(date,paidTo,sender,netPaidAmount,netReceivedAmount);
    } else if (lastTransactionS.length == 0 && lastTransactionR.length > 0) {
      const newSCurrentBalance =
      sentBy.type == "credit"
      ? sentBy.openingBalance
      : -1 * sentBy.openingBalance;

      const lastTransactionReceiver = lastTransactionR[lastTransactionR.length - 1];

      const newRCurrentBalance = String(lastTransactionReceiver.sender) == String(sender) ? lastTransactionReceiver.rCurrentBalance : lastTransactionReceiver.sCurrentBalance;

      // Transaction Creation
      newTransaction = await Transaction.create({
        date,
        paidTo,
        amount,
        receiverCommission,
        receiverCommissionPercentage,
        netPaidAmount,
        comisionTypeP,
        receiverName,
        receiverNumber,
        biltyNumber,
        senderCommission,
        senderCommissionPercentage,
        netReceivedAmount,
        comisionTypeS,
        receivedBy,
        sender,
        senderNumber,
        city,
        netComision,
        voucherNumber: "T" + (cashbookCount + transactionCount + 1),
        rCurrentBalance: newRCurrentBalance + netReceivedAmount,
        sCurrentBalance: newSCurrentBalance - netPaidAmount,
        postBy: req.user,
      });
      updateTransactionAfter(date,paidTo,sender,netPaidAmount,netReceivedAmount);
      
    }
     else if (lastTransactionS.length > 0 && lastTransactionR.length == 0) {
      const newRCurrentBalance =
        receiver.type == "credit"
          ? receiver.openingBalance
          : -1 * receiver.openingBalance;

          const lastTransactionSender = lastTransactionS[lastTransactionS.length - 1];

          const newSCurrentBalance = String(lastTransactionSender.paidTo) == String(paidTo) ? lastTransactionSender.sCurrentBalance : lastTransactionSender.rCurrentBalance;

      // Transaction Creation
      newTransaction = await Transaction.create({
        date,
        paidTo,
        amount,
        receiverCommission,
        receiverCommissionPercentage,
        netPaidAmount,
        comisionTypeP,
        receiverName,
        receiverNumber,
        biltyNumber,
        senderCommission,
        senderCommissionPercentage,
        netReceivedAmount,
        comisionTypeS,
        receivedBy,
        sender,
        senderNumber,
        city,
        netComision,
        voucherNumber: "T" + (cashbookCount + transactionCount + 1),
        rCurrentBalance: newRCurrentBalance + netReceivedAmount,
        sCurrentBalance: newSCurrentBalance - netPaidAmount,
        postBy: req.user,
      });
      updateTransactionAfter(date,paidTo,sender,netPaidAmount,netReceivedAmount);
      // const t = await Transaction.updateMany(
      //   { date: { $gt: date } },
      //   {
      //     $inc: {
      //       rCurrentBalance: netReceivedAmount,
      //       sCurrentBalance: -netPaidAmount,
      //     },
      //   }
      // );
    } else {
      const senderLastTransaction =
        lastTransactionS[lastTransactionS.length - 1];
      const receiverLastTransaction =
        lastTransactionR[lastTransactionR.length - 1];

      let newSCurrentBalance;
      let newRCurrentBalance;

      if (String(senderLastTransaction.paidTo) == String(paidTo)) {
        newSCurrentBalance = senderLastTransaction.sCurrentBalance;
      } else if (String(senderLastTransaction.sender) == String(paidTo)) {
        newSCurrentBalance = senderLastTransaction.rCurrentBalance;
      }

      if (String(receiverLastTransaction.paidTo) == String(sender)) {
        newRCurrentBalance = receiverLastTransaction.sCurrentBalance;
      } else if (String(receiverLastTransaction.sender) == String(sender)) {
        newRCurrentBalance = receiverLastTransaction.rCurrentBalance;
      }

      newTransaction = await Transaction.create({
        date,
        paidTo,
        amount,
        receiverCommission,
        receiverCommissionPercentage,
        netPaidAmount,
        comisionTypeP,
        receiverName,
        receiverNumber,
        biltyNumber,
        senderCommission,
        senderCommissionPercentage,
        netReceivedAmount,
        comisionTypeS,
        receivedBy,
        sender,
        senderNumber,
        city,
        netComision,
        voucherNumber: "T" + (cashbookCount + transactionCount + 1),
        rCurrentBalance: newRCurrentBalance + netReceivedAmount,
        sCurrentBalance: newSCurrentBalance - netPaidAmount,
        postBy: req.user,
      });

      updateTransactionAfter(date,paidTo,sender,netPaidAmount,netReceivedAmount);
    }
    // We have to update cashbook also
    let newComission ; 
    return res.status(201).json({ newTransaction, newComission });
    // return res.status(401).json({});
  } catch (error) {
    console.log(error);
    return res.send(500).json("Error in Transaction creation");
  }
};

const read = async (req, res) => {
  try {
    const allCashbook = await Transaction.find({});
    return res.status(200).json(allCashbook);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading cashbooks");
  }
};

const update = async (req, res) => {
  try {
    const {
      date,
      paidTo,
      amount,
      receiverCommission,
      receiverCommissionPercentage,
      netPaidAmount,
      comisionTypeP,
      receiverName,
      receiverNumber,
      biltyNumber,
      senderCommission,
      senderCommissionPercentage,
      netReceivedAmount,
      comisionTypeS,
      receivedBy,
      sender,
      senderNumber,
      city,
      netComision,
      sCurrentBalance,
      rCurrentBalance,
      postBy,
      id,
    } = req.body;

    // console.log(req.body);
    // Managing opening balance
    if (
      !date ||
      !paidTo ||
      !amount ||
      !comisionTypeP ||
      !receiverName ||
      !biltyNumber ||
      !comisionTypeS ||
      !receivedBy ||
      !sender ||
      !city ||
      !sCurrentBalance ||
      !rCurrentBalance ||
      !id ||
      !postBy
    )
      return res.status(411).json("Invalid Input");

    const transaction = await Transaction.findById(id);
    const sentBy = await Party.findById(paidTo);
    const receiver = await Party.findById(sender);

    if (!receiver || !sentBy) return res.status(404).json("Party not found");

    // Calculating Difference
    const rAmountDiffrence =
      +netReceivedAmount - +transaction.netReceivedAmount;
    const sAmountDiffrence = +netPaidAmount - +transaction.netPaidAmount;
    const netCommisionDiffrence = +netComision - +transaction.netComision;

    //Converting Transaction date object into string
    const dateObject = new Date(transaction.date);
    const dateString = dateObject.toISOString();

    // If Sender and receiver are same and date is same
    if (
      String(transaction.paidTo) == String(paidTo) &&
      String(transaction.sender) == String(sender) &&
      dateString == date
    ) {
      const c = await Transaction.findByIdAndUpdate(id, {
        date,
        paidTo,
        amount,
        receiverCommission,
        receiverCommissionPercentage,
        netPaidAmount,
        comisionTypeP,
        receiverName,
        receiverNumber,
        biltyNumber,
        senderCommission,
        senderCommissionPercentage,
        netReceivedAmount,
        comisionTypeS,
        receivedBy,
        sender,
        senderNumber,
        city,
        netComision,
        sCurrentBalance: +transaction.sCurrentBalance - +sAmountDiffrence,
        rCurrentBalance: +transaction.rCurrentBalance + +rAmountDiffrence,
        // voucherNumber: cashbookCount + transactionCount + 1,
        postBy: req.user,
      });

      const allTransactionOfSender = await Transaction.find({
        $and: [
          { date: { $gte: date } },
          { $or: [{ paidTo }, { sender: paidTo }] },
        ],
      }).sort({
        date: 1,
      });
      const allTransactionOfReceiver = await Transaction.find({
        $and: [
          { date: { $gte: date } },
          { $or: [{ sender }, { paidTo: sender }] },
        ],
      }).sort({
        date: 1,
      });

      let isEditableSender = false;
      allTransactionOfSender.forEach(async (t) => {
        if (String(transaction._id) == String(t._id)) isEditableSender = true;
        else if (isEditableSender) {
          if (String(t.paidTo) == String(paidTo)) {
            await Transaction.findByIdAndUpdate(t._id, {
              $inc: {
                sCurrentBalance: -sAmountDiffrence,
              },
            });
          } else if (String(t.sender) == String(paidTo)) {
            await Transaction.findByIdAndUpdate(t._id, {
              $inc: {
                rCurrentBalance: -sAmountDiffrence,
              },
            });
          }
        }
      });
      let isEditableReceiver = false;
      allTransactionOfReceiver.forEach(async (t) => {
        if (String(transaction._id) == String(t._id)) isEditableReceiver = true;
        else if (isEditableReceiver) {
          if (String(t.paidTo) == String(sender)) {
            await Transaction.findByIdAndUpdate(t._id, {
              $inc: {
                sCurrentBalance: rAmountDiffrence,
              },
            });
          } else if (String(t.sender) == String(sender)) {
            await Transaction.findByIdAndUpdate(t._id, {
              $inc: {
                rCurrentBalance: rAmountDiffrence,
              },
            });
          }
        }
      });

      await Party.updateMany(
        { _id: paidTo },
        { $inc: { currentBalance: -sAmountDiffrence } }
      );

      await Party.updateMany(
        { _id: sender },
        { $inc: { currentBalance: rAmountDiffrence } }
      );

      await Comission.updateOne(
        { transaction: id },
        { $inc: { amount: netCommisionDiffrence } }
      );
    }
    // If sender or receiver is different

    return res.status(201).json("Transaction updated");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in Transaction update");
  }
};

const deleteTransactionEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    const sentBy = await Party.findById(transaction.paidTo);
    const receiver = await Party.findById(transaction.sender);
    if (!receiver || !sentBy) return res.status(404).json("Party not found");

    const { date, paidTo, sender, netPaidAmount, netReceivedAmount } =
      transaction;
    const sAmountDiffrence = netPaidAmount;
    const rAmountDiffrence = netReceivedAmount;

    // Updating Reciver and sender Current balance
    receiver.currentBalance =
      receiver.currentBalance - transaction.netReceivedAmount;
    sentBy.currentBalance = sentBy.currentBalance + transaction.netPaidAmount;

    //Saving current balance changes
    await sentBy.save();
    await receiver.save();

    //Handling transactions update

    const allTransactionOfSender = await Transaction.find({
      $and: [
        { date: { $gte: date } },
        { $or: [{ paidTo }, { sender: paidTo }] },
      ],
    }).sort({
      date: 1,
    });
    const allTransactionOfReceiver = await Transaction.find({
      $and: [
        { date: { $gte: date } },
        { $or: [{ sender }, { paidTo: sender }] },
      ],
    }).sort({
      date: 1,
    });

    // console.log("Receiver Transaction", allTransactionOfReceiver);
    // console.log("Sender Transaction", allTransactionOfSender);
    
    let isEditableSender = false;
    allTransactionOfSender.forEach(async (t) => {
      if (String(transaction._id) == String(t._id)) isEditableSender = true;
      else if (isEditableSender) {
        if (String(t.paidTo) == String(paidTo)) {
          await Transaction.findByIdAndUpdate(t._id, {
            $inc: {
              sCurrentBalance: sAmountDiffrence,
            },
          });
        } else if (String(t.sender) == String(paidTo)) {
          await Transaction.findByIdAndUpdate(t._id, {
            $inc: {
              rCurrentBalance: sAmountDiffrence,
            },
          });
        }
      }
    });
    let isEditableReceiver = false;
    allTransactionOfReceiver.forEach(async (t) => {
      if (String(transaction._id) == String(t._id)) isEditableReceiver = true;
      else if (isEditableReceiver) {
        if (String(t.paidTo) == String(sender)) {
          await Transaction.findByIdAndUpdate(t._id, {
            $inc: {
              sCurrentBalance: -rAmountDiffrence,
            },
          });
        } else if (String(t.sender) == String(sender)) {
          await Transaction.findByIdAndUpdate(t._id, {
            $inc: {
              rCurrentBalance: -rAmountDiffrence,
            },
          });
        }
      }
    });

    // Deleting Existing commision
    await Comission.deleteOne({ transaction: id });

    await Transaction.deleteOne({ _id: id });
    // console.log(deleted);

    return res.status(200).json("Successfully Deleted");
  } catch (error) {
    console.log(error);
    return res.status(404).json("Error in deletion Cashbook");
  }
};

// Searching
const readByQuery = async (req, res) => {
  try {
    const { to, from, party } = req.body;
    // console.log(req.body);
    // console.log(date,party);
    if (to || (from && party)) {
      const transaction = await Transaction.find({
        $and: [
          { date: { $gte: from, $lte: to } },
          { $or: [{ paidTo: party }, { sender: party }] },
        ],
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      const cashbook = await Cashbook.find({
        $and: [
          { date: { $gte: from, $lte: to } },
          { $or: [{ paidTo: party }] },
        ],
      }).populate([{ path: "party", select: "name" }]);
      return res.status(200).json({ transaction, cashbook });
    }
    if (to && party) {
      const transaction = await Transaction.find({
        $and: [{ date: to }, { $or: [{ paidTo: party }, { sender: party }] }],
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      const cashbook = await Cashbook.find({
        $and: [{ date: to }, { $or: [{ party }] }],
      }).populate([{ path: "party", select: "name" }]);
      // transaction.length == 0 && transaction.push(await Party.findById(party));
      return res.status(200).json({ transaction, cashbook });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading transaction");
  }
};

const daily = async (req, res) => {
  try {
    // 2024-01-18T00:00:00.000+00:00
    const date = new Date();
    const year = date.getFullYear();
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    const searchDate = `${year}-${month}-${day}T00:00:00.000+00:00`;
    const cashbooks = await Transaction.find({ date: searchDate }).populate([
      { path: "paidTo", select: "name" },
      { path: "sender", select: "name" },
      { path: "postBy", select: "name" },
    ]);
    return res.status(200).json(cashbooks);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading Daily Transaction");
  }
};

const searchDailyTransaction = async (req, res) => {
  try {
    const { to, from, party } = req.query;

    if (to && from && party) {
      const transaction = await Transaction.find({
        $and: [
          { date: { $gte: from, $lte: to } },
          { $or: [{ paidTo: party }, { sender: party }] },
        ],
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      // transaction.length == 0 && transaction.push(await Party.findById(party));
      return res.status(200).json(transaction);
    }
    if (to && from) {
      const transaction = await Transaction.find({
        date: { $gte: from, $lte: to },
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      // transaction.length == 0 && transaction.push(await Party.findById(party));
      return res.status(200).json(transaction);
    }
    if (to && party) {
      const transaction = await Transaction.find({
        $and: [{ date: to }, { $or: [{ paidTo: party }, { sender: party }] }],
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      // transaction.length == 0 && transaction.push(await Party.findById(party));
      return res.status(200).json(transaction);
    }
    if (to) {
      const transaction = await Transaction.find({
        date: to,
      }).populate([
        { path: "paidTo", select: "name" },
        { path: "sender", select: "name" },
      ]);
      // transaction.length == 0 && transaction.push(await Party.findById(party));
      return res.status(200).json(transaction);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading transaction");
  }
};
const activeStatus = async (req, res) => {};

module.exports = {
  create,
  read,
  readByQuery,
  daily,
  update,
  searchDailyTransaction,
  deleteTransactionEntry,
};
