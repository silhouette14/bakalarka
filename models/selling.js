var mongoose = require('mongoose');

var SellingSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  totalCoins:{type:Number},
  coinName:{type:String},
  coinCurrentPrice:{type:String},
  totalAmount:{type:String},
  currency:{type:String},
  dateTime:{type:Date,default:Date.now()},
  cryptoCommission:{type:Number},
  lumpsumAmount:{type:String}
});


module.exports = mongoose.model('Selling',SellingSchema);
