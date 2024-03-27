const zod = require("zod");

const groupValidation = zod.object({
    name:zod.string()
})

module.exports = {groupValidation};