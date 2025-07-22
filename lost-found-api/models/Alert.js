const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  name: String,
  contact: String,
  proofUrl: String,
  message: String,
  status: String 
});
const alertSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, 
  image: String,
  contact: String, 
  claims: [claimSchema]
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
