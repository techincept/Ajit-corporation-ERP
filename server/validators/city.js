const zod = require('zod');

const cityValidator = zod.object({
    city:zod.string().min(3)
})

module.exports = {cityValidator}