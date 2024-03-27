const Transaction = require('../model/transaction.js');

const updateTransactionAfter = async(date,sender,receiver,netPaidAmount,netReceivedAmount)=>{
    await Transaction.updateMany(
        {$and:[{date:{$gt:date}},{sender}]},
        {$inc:{sCurrentBalance : -netPaidAmount}}
    );
    await Transaction.updateMany(
        {$and:[{date:{$gt:date}},{receiver:sender}]},
        {$inc:{rCurrentBalance : -netPaidAmount}}
    );
    await Transaction.updateMany(
        {$and:[{date:{$gt:date}},{sender:receiver}]},
        {$inc:{sCurrentBalance : netReceivedAmount}}
    );
    await Transaction.updateMany(
        {$and:[{date:{$gt:date}},{receiver}]},
        {$inc:{rCurrentBalance : netReceivedAmount}}
    );
}

module.exports = {updateTransactionAfter};