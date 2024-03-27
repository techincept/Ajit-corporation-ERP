const mongoose = require("mongoose");
const { partyValidator } = require("../validators/party");
const Party = require("../model/party.js");
const User = require("../model/user.js");
const Transaction = require('../model/transaction.js');
const Cashbook = require('../model/cashbook.js');

const createParty = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, city, openingBalance, type, group } = req.body;
    const { success } = partyValidator.safeParse(req.body);

    if (!success) {
      session.abortTransaction();
      return res.status(411).json({ message: "Invalid party data type" });
    }
    const creator = await User.findById(req.user);

    if (!creator) {
      session.abortTransaction();
      return res.status(404).json({ message: "Employee not found" });
    }
    if(creator.role == 'super') return res.status(403).json({message:"Party cannot be created by super admin"});

    const newParty = await Party.create({
      name,
      city,
      openingBalance,
      currentBalance: type == "credit" ? openingBalance : -1 * openingBalance,
      createdBy: req.user,
      group,
      type,
      company: creator.role == "company" ? creator._id : creator?.createdBy,
    });

    await session.commitTransaction();

    return res.status(201).json("Party created");
  } catch (error) {
    console.log(error);
    session.abortTransaction();
    return res.status(500).json({ message: "Error in Party Creation", error });
  }
};

const readParty = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: "User Not Found" });

    let parties = [];

    if (user.role == "company") {
      parties = await Party.find({ company: user._id });
    } else if (user.role == "employee") {
      parties = await Party.find({
        $and: [{ createdBy: user._id }, { company: user.createdBy }],
      });
    }
    return res.status(200).json(parties);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error in reading parties");
  }
};

const updateParty = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id, name, city, openingBalance, type } = req.body;
    const { success } = partyValidator.safeParse(req.body);

    if (!success) {
      session.abortTransaction();
      return res.status(411).json({ message: "Invalid party data type" });
    }

    const creator = await User.findById(req.user);
    if(!creator) return res.status(404).json({message:"Employee not found"});
    if(creator.role == 'super') return res.status(403).json({message:"Party cannot be updated by superadmin"});
    
    
    const party = await Party.findById(id);

    if (!party) {
      session.abortTransaction();
      return res.status(404).json({ message: "Party not found" });
    }

    let newOpeningBalance =
      type == "credit" ? +openingBalance : -1 * +openingBalance;

    let preOpeningBalance =
      party.type == "credit"
        ? +party.openingBalance
        : -1 * +party.openingBalance;

    const difference = +newOpeningBalance - +preOpeningBalance;

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

    //   Updating if the party is receiver
    await Transaction.updateMany(
      { receiver: id },
      { $inc: { rCurrentBalance: difference } }
    );

    //   Updating if the party is sender
    await Transaction.updateMany(
      { sender: id },
      { $inc: { sCurrentBalance: difference } }
    );

    //Updating cashbook transaction of that party
    await Cashbook.updateMany(
      { party: id },
      { $inc: { currentBalance: difference } }
    );

    await session.commitTransaction();

    return res.status(201).json("Party Updated Successfully");
  } catch (error) {
    session.abortTransaction();
    console.log(error);
    return res.send(500).json("Error in party creation");
  }
};

module.exports = { createParty, readParty, updateParty };
