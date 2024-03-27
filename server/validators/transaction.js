const zod = require('zod');

transactionValidator = zod.object({
    date : zod.string("date"),
    sender :zod.string("sender").min(8),
    amount:zod.number("amount"),
    receiverCommission : zod.number("receiver commission"),
    receiverCommissionPercentage : zod.number("receiver commission percentage"),
    netPaidAmount : zod.number("net paid amount"),
    comisionTypeP : zod.string("comision type p"),
    receiverName : zod.string("receiver name"),
    receiverNumber : zod.number("receiver number"),
    biltyNumber : zod.string("bilty number"),
    senderCommission : zod.number("sender commission"),
    senderCommissionPercentage : zod.number("sender commission percentage"),
    netReceivedAmount : zod.number("net received amount"),
    comisionTypeS : zod.string("comision type s"),
    receivedBy : zod.string("received by"),
    receiver :  zod.string("receiver").min(8),
    senderNumber : zod.number("sender number"),
    city : zod.string("city").min(8),
    netComision : zod.number("net comision") ,
})

module.exports = {transactionValidator}