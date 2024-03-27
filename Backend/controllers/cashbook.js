const Cashbook = require("../models/cashBook.js");
const Transaction = require("../models/transaction.js");
const Party = require("../models/party.js");

const create = async (req, res) => {
  try {
    const { cashbook, party, amount, type, narration, date } = req.body;
    // Managing Current balance
    const isParty = await Party.findById(party);
    if (!isParty) return res.status(404).json("Party not found");
    if (isParty && type == "credit")
      isParty.currentBalance = +isParty.currentBalance + +amount;
    else if (isParty && type == "debit")
      isParty.currentBalance = +isParty.currentBalance - +amount;

    const cashbookCount = await Cashbook.countDocuments({});
    const transactionCount = await Transaction.countDocuments({});
    const newCashbook = await Cashbook.create({
      cashbook,
      party,
      amount,
      type,
      narration,
      date,
      voucherNumber: "C" + (cashbookCount + transactionCount + 1),
      postedBy: req.user,
    });
    await isParty.save();

    newCashbook.currentBalance = isParty.currentBalance;

    await newCashbook.save();

    return res.status(201).json("Cashbook created");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in Cashbook creation");
  }
};

const read = async (req, res) => {
  try {
    const allCashbook = await Cashbook.find({});
    return res.status(200).json(allCashbook);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading cashbooks");
  }
};

const readByQuery = async (req, res) => {
  try {
    const { date, party } = req.body;
    // console.log(req.body);
    const cashbooks = await Cashbook.find({
      $and: [{ date }, { cashbook: party }],
    }).populate([
      { path: "cashbook", select: "name" },
      { path: "party", select: "name" },
      { path: "postBy", select: "name" },
    ]);
    return res.status(200).json(cashbooks);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in search cashbooks");
  }
};

const activeStatus = async (req, res) => {};

module.exports = { create, read, readByQuery };
