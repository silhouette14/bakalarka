// symbol: 'BNBETH',
// orderId: 4480717,
// clientOrderId: 'te38xGILZUXrPZHnTQPH6h',
// transactTime: 1509049732437,
// price: '0.00402030',
// origQty: '5.00000000',
// executedQty: '5.00000000',
// status: 'FILLED',
// timeInForce: 'GTC',
// type: 'LIMIT',
// side: 'BUY'

var mongoose = require('mongoose');

var LimitOrderSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  symbol: {type:String},
  orderId: {type:String},
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


module.exports = mongoose.model('LimitOrder',LimitOrderSchema);
