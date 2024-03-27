const zod = require('zod');

const userValidator = zod.object({
    name:zod.string().trim(),
    // userName:zod.string(),
    mobile:zod.string().trim().min(10).max(10),
    email:zod.string().trim().email(),
    role:zod.enum(['super','company','employee']),
    password:zod.string().trim().min(6),
})
const loginValidator = zod.object({
    email:zod.string().trim().email(),
    password:zod.string().trim().min(6),
})

module.exports = {userValidator,loginValidator}