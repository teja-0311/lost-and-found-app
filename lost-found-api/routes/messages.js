const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages sent to a specific user
router.get('/:email', async (req, res) => {
  const email = req.params.email;
  const messages = await Message.find({ to: email }).sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = router;
