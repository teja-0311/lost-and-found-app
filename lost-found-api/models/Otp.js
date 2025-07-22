const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date
});

module.exports = mongoose.model('Otp', OtpSchema);
