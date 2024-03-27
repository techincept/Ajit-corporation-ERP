const mongoose = require('mongoose');

const cashbookSchema = mongoose.Schema({
    company : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    party:{type:mongoose.Schema.Types.ObjectId,ref:'Party'},
    cashbook : {type:mongoose.Schema.Types.ObjectId,ref:'Party'},
    amount:{type:Number,required:true},
    type:{type:String,required:true},
    narration:{type:String},
    date:{type:String,default:Date.now,required:true},
    voucherNumber : {type:String,required:true},
    postBy : {type:mongoose.Schema.Types.ObjectId,ref:'User'},
    currentBalance : {type:Number}
})

module.exports = mongoose.model('Cashbook',cashbookSchema);