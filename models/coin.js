var mongoose = require('mongoose');

var CoinSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  coinName:{type:Array},
  amount:{type:Array}
});


module.exports = mongoose.model('Coin',CoinSchema);
