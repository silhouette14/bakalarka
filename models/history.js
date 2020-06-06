var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  symbol: {type:String},
  orderId: {type:String,unique:true},
  clientOrderId: {type:String},
  transactTime: {type:String},
  price: {type:Number},
  origQty: {type:Number},
  executedQty: {type:Number},
  status: {type:String},
  timeInForce: {type:String},
  type: {type:String},
  side: {type:String} ,
  adminStatus: {type:String,default:"UNFILLED"}
});


module.exports = mongoose.model('History',HistorySchema);
