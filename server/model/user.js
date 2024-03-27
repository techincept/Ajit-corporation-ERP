const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    userName:{type:String,required:true}, //generate
    mobile:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,enum:['super','company','employee'],required:true},
    password:{type:String,required:true},
    voucherCount: {type:Number,default:0}, //only for Admin
    createdBy:{type:mongoose.Schema.Types.ObjectId,required:function(){
        return this.role!='super'?true:false;
    }}
},{timestamps:true})

module.exports = mongoose.model('User',userSchema);