const zod = require('zod');

const partyValidator = zod.object({
    name:zod.string().trim(),
    city:zod.string().trim(),
    openingBalance:zod.number(),
    group:zod.array(zod.string()).optional(),
    type:zod.enum(['credit','debit'])
})

module.exports = {partyValidator}