const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  to: String,            
  from: String,          
  itemTitle: String,
  itemImage: String,
  itemType: String,
  message: String,
  status: String         
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
