const mongoose = require('mongoose');

const partySchema = mongoose.Schema(
    {
      name: { type: String, required: true,unique:true },
      city: { type: mongoose.Schema.Types.ObjectId,ref:"City", required: true },
      openingBalance: { type: Number, default: 0 },
      currentBalance: { type: Number, default:0 },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
      group:[{type:mongoose.Schema.Types.ObjectId,ref:"Group"}],
      type: {type:String,required:true,enum:['credit','debit']},
      isActive:{type:Boolean,default:true},
      company:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
    },
    { timestamps: true },
  );

  module.exports = mongoose.model("Party", partySchema);