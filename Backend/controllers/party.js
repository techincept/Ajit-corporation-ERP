const Party = require("../models/party.js");
const Transaction = require("../models/transaction.js");
const Cashbook = require("../models/cashBook.js");

const create = async (req, res) => {
  try {
    const { name, city, openingBalance, type } = req.body;
    const newParty = await Party.create({
      name,
      city,
      openingBalance,
      currentBalance: type == "credit" ? openingBalance : -1 * openingBalance,
      createdBy: req.user,
      type,
    });
    return res.status(201).json("Party created");
  } catch (error) {
    console.log(error);
    return res.send(500).json("Error in party creation");
  }
};

const read = async (req, res) => {
  try {
    const allParties = await Party.find({});
    return res.status(200).json(allParties);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading parties");
  }
};

const update = async (req, res) => {
  try {
    const { id, name, city, openingBalance, type } = req.body;
    const party = await Party.findById(id);

    let newOpeningBalance =
      type == "credit" ? +openingBalance : -1 * +openingBalance;

    let preOpeningBalance =
      party.type == "credit"
        ? +party.openingBalance
        : -1 * +party.openingBalance;

    const diffrence = +newOpeningBalance - +preOpeningBalance;

    // const diffrence =
    //   +newOpeningBalance + +preOpeningBalance - +party.currentBalance;

    // console.table({
    //   nob: newOpeningBalance,
    //   pob: preOpeningBalance,
    //   diffrence,
    //   ncb:
    //     Number(party.currentBalance) -
    //     Number(preOpeningBalance) +
    //     newOpeningBalance,
    // });

    const updateParty = await Party.findByIdAndUpdate(id, {
      name,
      city,
      openingBalance,
      type,
      currentBalance:
        Number(party.currentBalance) -
        Number(preOpeningBalance) +
        newOpeningBalance,
      createdBy: req.user,
    });
    await Transaction.updateMany(
      { sender: id },
      { $inc: { rCurrentBalance: diffrence } }
    );
    await Transaction.updateMany(
      { paidTo: id },
      { $inc: { sCurrentBalance: diffrence } }
    );
    await Cashbook.updateMany(
      { party: id },
      { $inc: { currentBalance: diffrence } }
    );

    return res.status(201).json("Party created");
  } catch (error) {
    console.log(error);
    return res.send(500).json("Error in party creation");
  }
};

const activeStatus = async (req, res) => {};

module.exports = { create, read, update };
