var mongoose = require('mongoose');

var PurchaseSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  totalCoins:{type:Number},
  coinName:{type:String},
  coinCurrentPrice:{type:String},
  totalAmountPayed:{type:String},
  currency:{type:String},
  dateTime:{type:Date,default:Date.now()},
  cryptoCommission:{type:Number},
  lumpsumAmount:{type:String}
});


module.exports = mongoose.model('Purchase',PurchaseSchema);
