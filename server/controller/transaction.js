const Cashbook = require("../model/cashbook");
const Comission = require("../model/comission");
const Party = require("../model/party");
const Transaction = require("../model/transaction");
const User = require("../model/user");
const { updateTransactionAfter } = require("../utils/transactionUpdater");
const { transactionValidator } = require("../validators/transaction");

const create = async (req, res) => {
    try {
        const {
            date,
            sender,
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
            receiver,
            senderNumber,
            city,
            netComision,
        } = req.body;
        const { success } = transactionValidator.safeParse(req.body);

        if (!success) {
            return res.status(411).json({ message: "Invalid Input" });
        }

        const user = await User.findById(req.user);
        if (user.role == 'super') return res.status(403).json({ message: "Transaction cannot be created" });
        const sentBy = await Party.findById(sender);
        const sentTo = await Party.findById(receiver);
        if (user?.role == 'company' && !user?._id.compare.equals(sentBy?.company) && !sentBy?.company.equals(sentTo?.company)) return res.status(411).json({ message: "Transaction creation cannot be done" });
        if (user?.role == 'employee' && !sentBy?.company.equals(sentTo?.company) && user?.createdBy != sentBy?.company) return res.status(403).json({ message: "Transaction creation error" });

        const lastTransactionR = await Transaction.find({
            $and: [
                { date: { $lte: date } },
                { $or: [{ receiver }, { sender: receiver }] },
            ],
        }).sort({ date: 1 });

        const lastTransactionS = await Transaction.find({
            $and: [
                { date: { $lte: date } },
                { $or: [{ sender }, { receiver: sender }] },
            ],
        }).sort({ date: 1 });

        if (!sentBy || !sentTo) return res.status(404).json({ message: "Party not found" });

        //Managing opening balance
        sentTo.currentBalance = sentTo.currentBalance + netReceivedAmount;
        sentBy.currentBalance = sentBy.currentBalance - netPaidAmount;

        //saving current balance changes
        await sentBy.save();
        await sentTo.save();

        let newTransaction;
        let voucher;
        (user.role == 'company') ? voucher = user : voucher = await User.findById(user.createdBy);

        //checking for previous transaction
        if (lastTransactionS.length == 0 && lastTransactionR.length == 0) {
            const newSCurrentBalance = sentBy.type == 'credit' ? sentBy.openingBalance : -1 * sentBy.openingBalance;
            const newRCurrentBalance = sentTo.type == 'credit' ? sentTo.openingBalance : -1 * sentTo.openingBalance;

            //transaction creation
            newTransaction = await Transaction.create({
                date,
                sender,
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
                receiver,
                senderNumber,
                city,
                netComision,
                voucherNumber: "T" + (voucher.voucherCount+1),
                sCurrentBalance: newRCurrentBalance + netReceivedAmount,
                rCurrentBalance: newSCurrentBalance - netPaidAmount,
                postBy: req.user,
                company: (user.role == 'company' ? user._id : user.createdBy)
            })
            voucher.voucherCount++;
            await voucher.save();
            updateTransactionAfter(date, sender, receiver, netPaidAmount, netReceivedAmount);
        } else if (lastTransactionS.length == 0 && lastTransactionR.length > 0) {
            const newSCurrentBalance = sentBy.type == 'credit' ? sentBy.openingBalance : -1 * sentBy.openingBalance;
            const lastTransactionReceiver = lastTransactionR[lastTransactionR.length - 1];
            const newRCurrentBalance = String(lastTransactionReceiver.receiver) == String(receiver) ? lastTransactionReceiver.rCurrentBalance : lastTransactionReceiver.sCurrentBalance;

            //transaction creation
            newTransaction = await Transaction.create({
                date,
                sender,
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
                receiver,
                senderNumber,
                city,
                netComision,
                voucherNumber: "T" + (voucher.voucherCount+1),
                sCurrentBalance: newRCurrentBalance + netReceivedAmount,
                rCurrentBalance: newSCurrentBalance - netPaidAmount,
                postBy: req.user,
                company: (user.role == 'company' ? user._id : user.createdBy)
            })
            voucher.voucherCount++;
            await voucher.save();
            updateTransactionAfter(date, sender, receiver, netPaidAmount, netReceivedAmount)
        } else if (lastTransactionS.length > 0 && lastTransactionR.length == 0) {
            const newRCurrentBalance = sentBy.type == 'credit' ? sentBy.openingBalance : -1 * sentBy.openingBalance;
            const lastTransactionSender = lastTransactionS[lastTransactionS.length - 1];
            const newSCurrentBalance = String(lastTransactionSender.sender) == String(sender) ? lastTransactionSender.sCurrentBalance : lastTransactionSender.rCurrentBalance;

            //transaction creation
            newTransaction = await Transaction.create({
                date,
                sender,
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
                receiver,
                senderNumber,
                city,
                netComision,
                voucherNumber: "T" + (voucher.voucherCount+1),
                sCurrentBalance: newRCurrentBalance + netReceivedAmount,
                rCurrentBalance: newSCurrentBalance - netPaidAmount,
                postBy: req.user,
                company: (user.role == 'company' ? user._id : user.createdBy)
            })
            voucher.voucherCount++;
            await voucher.save();
            updateTransactionAfter(date, sender, receiver, netPaidAmount, netReceivedAmount)
        } else {
            const senderLastTransaction = lastTransactionS[lastTransactionS.length - 1];
            const receiverLastTransaction = lastTransactionR[lastTransactionR.length - 1];

            let newSCurrentBalance;
            let newRCurrentBalance;

            if (String(senderLastTransaction.sender) == String(sender)) {
                newSCurrentBalance = senderLastTransaction.sCurrentBalance;
            } else if (String(senderLastTransaction.receiver) == String(sender)) {
                newSCurrentBalance = senderLastTransaction.rCurrentBalance;
            }

            if (String(receiverLastTransaction.sender) == String(receiver)) {
                newRCurrentBalance = receiverLastTransaction.sCurrentBalance;
            } else if (String(receiverLastTransaction.receiver) == String(receiver)) {
                newRCurrentBalance = receiverLastTransaction.rCurrentBalance;
            }

            newTransaction = await Transaction.create({
                date,
                sender,
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
                receiver,
                senderNumber,
                city,
                netComision,
                voucherNumber: "T" + (voucher.voucherCount+1),
                sCurrentBalance: newRCurrentBalance + netReceivedAmount,
                rCurrentBalance: newSCurrentBalance - netPaidAmount,
                postBy: req.user,
                company: (user.role == 'company' ? user._id : user.createdBy)
            });
            voucher.voucherCount++;
            await voucher.save();
            updateTransactionAfter(date, sender, receiver, netPaidAmount, netReceivedAmount);
        }
        //Commission creation
        const newComission = await Comission.create({
            company:(user.role == 'company' ? user._id : user.createdBy),
            amount:netComision ,
            transaction:newTransaction._id,
         });

         return res.status(201).json({ newTransaction, newComission })
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in Transaction creation");
    }
}

const read = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (user.role == 'super') return res.status(403).json({ message: "Data access denied" })
        const id = user.role == 'company' ? user._id : user.createdBy;
        const allCashbook = await Transaction.find({ company: id });
        return res.status(200).json(allCashbook);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Error in reading Cashbooks");
    }
}

const update = async (req, res) => {
    try {
        const {
            id,
            date,
            sender,
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
            receiver,
            senderNumber,
            city,
            netComision,
            postBy,
            sCurrentBalance,
            rCurrentBalance
        } = req.body;

        //managing opening balance
        if (!date ||
            !sender ||
            !amount ||
            !comisionTypeP ||
            !receiverName ||
            !biltyNumber ||
            !comisionTypeS ||
            !receivedBy ||
            !receiver ||
            !city ||
            !sCurrentBalance ||
            !rCurrentBalance ||
            !id ||
            !postBy
        ) return res.status(411).json("Invalid Input");

        const user = await User.findById(req.user);
        const transaction = await Transaction.findById(id);
        if (user.role == 'super') return res.status(403).json({ message: "Update forbidden" });
        else if (!user._id.equals(transaction.postBy) && !user._id.equals(transaction.company)) return res.status(403).json({ message: "transaction cannot be updated" });

        const sentBy = await Party.findById(sender);
        const sentTo = await Party.findById(receiver);

        if (!sentBy || !sentTo) return res.status(404).json("Party not found");

        //calculating difference
        const rAmountDifference = +netReceivedAmount - +transaction.netReceivedAmount;
        const sAmountDifference = +netPaidAmount - +transaction.netPaidAmount;
        const netCommissionDifference = +netComision - +transaction.netComision;

        //converting transaction date object into string
        const dateObject = new Date(transaction.date);
        const dateString = dateObject.toISOString();

        //if sender and receiver are same and date is same
        if (
            String(transaction.sender) == String(sender) &&
            String(transaction.receiver) == String(receiver) &&
            dateString == date
        ) {
            const c = await Transaction.findByIdAndUpdate(id, {
                date,
                sender,
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
                receiver,
                senderNumber,
                city,
                netComision,
                sCurrentBalance: +transaction.sCurrentBalance - +sAmountDifference,
                rCurrentBalance: +transaction.rCurrentBalance + +rAmountDifference,
                postBy,
            })

            const allTransactionOfSender = await Transaction.find({
                $and: [
                    { date: { $gte: date } },
                    { $or: [{ sender }, { receiver: sender }] },
                ],
            }).sort({
                date: 1,
            })

            const allTransactionOfReceiver = await Transaction.find({
                $and: [
                    { date: { $gte: date } },
                    { $or: [{ receiver }, { sender: receiver }] }
                ]
            }).sort({
                date: 1,
            });

            let isEditableSender = false;
            allTransactionOfSender.forEach(async (t) => {
                if (String(transaction._id) == String(t._id)) isEditableSender = true;
                else if (isEditableSender) {
                    if (String(t.sender) == String(sender)) {
                        await Transaction.findByIdAndUpdate(t._id, {
                            $inc: {
                                sCurrentBalance: -sAmountDifference,
                            },
                        });
                    } else if (String(t.receiver) == String(sender)) {
                        await Transaction.findByIdAndUpdate(t._id, {
                            $inc: {
                                rCurrentBalance: -sAmountDifference,
                            },
                        });
                    }
                }
            });
            let isEditableReceiver = false;
            allTransactionOfReceiver.forEach(async (t) => {
                if (String(transaction._id) == String(t._id)) isEditableReceiver = true;
                else if (isEditableReceiver) {
                    if (String(t.sender) == String(receiver)) {
                        await Transaction.findByIdAndUpdate(t._id, {
                            $inc: {
                                sCurrentBalance: rAmountDifference,
                            },
                        });
                    } else if (String(t.receiver) == String(receiver)) {
                        await Transaction.findByIdAndUpdate(t._id, {
                            $inc: {
                                rCurrentBalance: rAmountDifference
                            },
                        });
                    }
                }
            });
            await Party.updateMany(
                { _id: sender },
                { $inc: { currentBalance: -sAmountDifference } }
            );

            await Party.updateMany(
                { _id: receiver },
                { $inc: { currentBalance: rAmountDifference } }
            );

            //commission schema create then update
            await Comission.updateMany(
                {transaction:id},
                {$inc:{amount:netCommissionDifference}}
            );
        }

        return res.status(201).json({ message: "Transaction updated" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in transaction update" });
    }
}

const deleteTransactionEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user);
        const transaction = await Transaction.findById(id);
        if (user.role == 'super') return res.status(403).json({ message: "Delete forbidden" });
        else if (user._id != transaction.postBy && user._id != transaction.company) return res.status(403).json({ message: "transaction cannot be deleted" });
        const sentBy = await Party.findById(transaction.sender);
        const sentTo = await Party.findById(transaction.receiver);
        if (!sentBy || !sentTo) return res.status(404).json({ message: "Party not found" });

        const { date, sender, receiver, netPaidAmount, netReceivedAmount } = transaction;
        const sAmountDifference = netPaidAmount;
        const rAmountDifference = netReceivedAmount;

        //updating receiver and sender current balance
        sentTo.currentBalance = sentTo.currentBalance - transaction.netReceivedAmount;
        sentBy.currentBalance = sentBy.currentBalance + transaction.netPaidAmount;

        //saving current balance changes
        await sentBy.save();
        await sentTo.save();

        //handling transaction update 

        const allTransactionOfSender = await Transaction.find({
            $and: [
                { date: { $gte: date } },
                { $or: [{ sender }, { receiver: sender }] },
            ]
        }).sort({
            date: 1
        });
        const allTransactionOfReceiver = await Transaction.find({
            $and: [
                { date: { $gte: date } },
                { $or: [{ receiver }, { sender: receiver }] },
            ]
        }).sort({
            date: 1
        })

        let isEditableSender = false;
        allTransactionOfSender.forEach(async (t) => {
            if (String(transaction._id) == String(t._id)) isEditableSender = true;
            else if (isEditableSender) {
                if (String(t.sender) == String(sender)) {
                    await Transaction.findByIdAndUpdate(t._id, {
                        $inc: {
                            sCurrentBalance: sAmountDifference,
                        },
                    });
                } else if (String(t.receiver) == String(sender)) {
                    await Transaction.findByIdAndUpdate(t._id, {
                        $inc: {
                            rCurrentBalance: sAmountDifference,
                        }
                    });
                }
            }
        });
        let isEditableReceiver = false;
        allTransactionOfReceiver.forEach(async (t) => {
            if (String(transaction._id) == String(t._id)) isEditableReceiver = true;
            else if (isEditableReceiver) {
                if (String(t.sender) == String(receiver)) {
                    await Transaction.findByIdAndUpdate(t._id, {
                        $inc: {
                            rCurrentBalance: -rAmountDifference,
                        },
                    });
                }
            }
        });

        //deleting existing commision
        await Comission.deleteOne({transaction:id});

        await Transaction.deleteOne({ _id: id });
        return res.status(200).json({ message: "Successfully deleted" });

    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Error in deletion cashbook" });
    }
}

//searching 
const readByQuery = async (req, res) => {
    try {
        const { to, from, party } = req.query;
        if (to || (from && party)) {
            const transaction = await Transaction.find({
                $and: [
                    { date: { $gte: from, $lte: to } },
                    { $or: [{ sender: party }, { receiver: party }] },
                ],
            }).populate([
                { path: "sender", select: 'name' },
                { path: 'receiver', select: 'name' },
            ]);
            const cashbook = await Cashbook.find({
                $and: [
                  { date: { $gte: from, $lte: to } },
                  { $or: [{ paidTo: party }] },
                ],
              }).populate([{ path: "party", select: "name" }]);
            return res.status(200).json({ transaction ,cashbook});
        }
        if (to && party) {
            const transaction = await Transaction.find({
                $and: [{ date: to }, { $or: [{ sender: party }, { receiver: party }] }],
            }).populate([
                { path: 'sender', select: 'name' },
                { path: 'receiver', select: 'name' },
            ]);
            const cashbook = await Cashbook.find({
                $and: [{ date: to }, { $or: [{ party }] }],
              }).populate([{ path: "party", select: "name" }]);

            return res.status(200).json({ transaction,cashbook });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in reading transaction" });
    }
}

const daily = async (req, res) => {
    try {
        // 2024-01-18T00:00:00.000+00:00
        const date = new Date();
        const year = date.getFullYear();
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        const searchDate = `${year} - ${month} - ${day}T00:00:00.000+00:00`;
        const cashbook = await Transaction.find({ date: searchDate }).populate([
            { path: 'sender', select: 'name' },
            { path: 'receiver', select: 'name' },
            { path: 'postBy', select: 'name' }
        ]);
        return res.status(200).json(cashbook);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in reading daily transaction" });
    }
}

const searchDailyTransaction = async (req, res) => {
    try {
        const { to, from, party } = req.query;
        if (to && party && from) {
            const transaction = await Transaction.find({
                $and: [
                    { date: { $gte: from, $lte: to } },
                    { $or: [{ sender: party }, { receiver: party }] },
                ]
            }).populate([
                { path: 'sender', select: 'name' },
                { path: 'receiver', select: 'name' }
            ])
            return res.status(200).json(transaction);
        }
        if (to && from) {
            const transaction = await Transaction.find({
                date: { $gte: from, $lte: to },
            }).populate([
                { path: 'sender', select: 'name' },
                { path: 'receiver', select: 'name' }
            ]);
            return res.status(200).json(transaction);
        }
        if (to && party) {
            const transaction = await Transaction.find({
                $and: [{ date: to }, { $or: [{ sender: party }, { receiver: party }] }]
            }).populate([
                { path: 'sender', select: 'name' },
                { path: 'receiver', select: 'name' }
            ])
            return res.status(200).json(transaction);
        }
        if (to) {
            const transaction = await Transaction.find({
                date: to,
            }).populate([
                { path: 'sender', select: 'name' },
                { path: 'receiver', select: 'name' }
            ]);
            return res.status(200).json(transaction);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in reading transaction" });
    }
}


module.exports = {
    create,
    read,
    update,
    deleteTransactionEntry,
    readByQuery,
    daily,
    searchDailyTransaction
}