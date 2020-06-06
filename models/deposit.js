var mongoose = require('mongoose');

var DepositSchema = new mongoose.Schema(
{
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  coinName:{type:String},
  txid:{type:String},
  amount:{type:Number},
  status:{type:Boolean,default:false},
  dateTime:{type:Date,default:Date.now()}
});


module.exports = mongoose.model('Deposit',DepositSchema);
