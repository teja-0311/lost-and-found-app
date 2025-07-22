const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');

// verify Gmail credentials dynamically
const smtpLogin = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass: password },
  });

  try {
    await transporter.verify();
    return transporter;
  } catch (e) {
    console.error(' Gmail verification failed:', e.message);
    throw new Error('Invalid Gmail credentials');
  }
};

// ==============================
// POST /api/auth/send-otp
// ==============================
router.post('/send-otp', async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const transporter = await smtpLogin(email, password);

    //Send OTP
    await transporter.sendMail({
      from: email,
      to: email,
      subject: '🔐 Your OTP Verification Code',
      text: `Your One-Time Password is: ${otp}`,
    });

    //Store OTP
    await Otp.findOneAndUpdate(
      { email },
      { code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true, new: true }
    );

    //Save or update user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({ name, email, phone, password });
    }

    console.log(` OTP sent to ${email}: ${otp}`);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in send-otp:', err.message);
    return res.status(400).json({ message: err.message || 'Failed to send OTP' });
  }
});


// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    const now = new Date();
    if (record.code === otp.trim() && record.expiresAt > now) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      await Otp.deleteOne({ email }); 

      console.log(` OTP verified for ${email}`);
      return res.status(200).json({ message: 'OTP verified', user });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error(' Error in verify-otp:', err.message);
    return res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

module.exports = router;
