var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  accountNumber:{type:String},
  bankName:{type:String}
});


module.exports = mongoose.model('Account',AccountSchema);
