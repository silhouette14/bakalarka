var mongoose = require('mongoose');

var WithdrawRequestSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  coinName:{type:String},
  address:{type:String},
  amount:{type:Number},
  tag:{type:String},
  dateTime:{type:Date,default:Date.now(),
  status:{type:String, enum:['pending','approved','rejected']}}
});


module.exports = mongoose.model('WithdrawRequest',WithdrawRequestSchema);
