const Cashbook = require('../model/cashbook.js');
const Transaction = require('../model/transaction.js');
const Party = require('../model/party.js');
const User = require('../model/user.js');
const cashbookValidator = require('../validators/cashbook.js')

const create = async(req,res)=>{
    try {
        const {
            cashbook,
            party,
            amount,
            type,
            narration,
            date
        } = req.body;

        const {success} = cashbookValidator.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Invalid Input" });
        }
        const user = await User.findById(req.user);
        if (user.role == 'super') return res.status(403).json({ message: "Cashbook cannot be created" });
        const isParty =  await Party.findById(party);
        if(!isParty) return res.status(404).json({message:"Party not found"});
        
        const isCashbook = await Party.findById(cashbook);
        if(!isCashbook) return res.status(404).json({message:"Cashbook not found"});
        if (user?.role == 'company' && !user?._id.compare.equals(isParty?.company) && !isParty?.company.equals(isCashbook?.company)) return res.status(411).json({ message: "Cashbook creation cannot be done" });
        if (user?.role == 'employee' && !isParty?.company.equals(isCashbook?.company) && user?.createdBy != isParty?.company) return res.status(403).json({ message: "Cashbook creation error" });

        //managing current balance
        if(isParty && type == "credit") isParty.currentBalance = +isParty.currentBalance - +amount;
        else if(isParty && type == "debit") isParty.currentBalance = +isParty.currentBalance - +amount;

        let voucher;
        (user.role == 'company') ? voucher = user : voucher = await User.findById(user.createdBy);

        const newCashbook  = await Cashbook.create({
            company:(user.role == 'company' ? user._id : user.createdBy),
            cashbook,
            party,
            amount,
            type,
            narration,
            date,
            voucherNumber : "C" + (voucher.voucherCount + 1),
            postBy :  req.user
        })
        voucher.voucherCount++;
        await voucher.save();

        await isParty.save();

        newCashbook.currentBalance = isParty.currentBalance;
        await newCashbook.save();

        return res.status(201).json({message:"Cashbook created"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in cashbook creation");
    }
}

const read = async(req,res)=>{
    try {
        const user = await User.findById(req.user);
        if (user.role == 'super') return res.status(403).json({ message: "Data access denied" })
        const id = (user.role == 'company' ? user._id : user.createdBy);
        const allCashbook = await Cashbook.find({ company: id });
        return res.status(200).json(allCashbook);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in reading Cashbooks");
    }
}

const readByQuery = async(req,res)=>{
    try {
        const {date,party} = req.query;
        const cashbooks = await Cashbook.find({
            $and:[{date},{cashbook:party}],
        }).populate([
            {path:'cashbook',select:'name'},
            {path:'party',select:'name'},
            {path:'postBy',select:'name'}
        ]);
        return res.status(200).json(cashbooks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error in search cashbooks"});
    }
}

module.exports = {create,read,readByQuery}