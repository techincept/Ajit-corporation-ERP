const zod = require('zod');

const cashbookValidator = zod.object({
    company : zod.string().min(8),
    party:zod.string().min(8),
    cashbook : zod.string().min(8),
    amount: zod.number(),
    type:zod.string(),
    date:zod.string(),
    currentBalance:zod.number()
})

module.exports = {cashbookValidator}