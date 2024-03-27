const mongoose = require('mongoose');

const comissionSchema = mongoose.Schema({
    adminId : {type:mongoose.Schema.Types.ObjectId,required:true},
    amount:{type:Number,required:true},
    transaction:{type:mongoose.Schema.Types.ObjectId,ref:'Transaction'}
})

module.exports = mongoose.model('Comission',comissionSchema);