const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Message = require('../models/Message');

// GET all alerts
router.get('/', async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});

// POST new alert
router.post('/', async (req, res) => {
  const { title, description, type, image, contact } = req.body;
  if (!title || !type || !image || !contact) {
    return res.status(400).send('Missing fields');
  }
  const alert = await Alert.create({ title, description, type, image, contact });
  res.status(201).json(alert);
});

// POST claim
router.post('/:id/claim', async (req, res) => {
  const { name, contact, proofUrl } = req.body;
  const alert = await Alert.findById(req.params.id);
  if (!alert) return res.status(404).send('Not found');

  alert.claims.push({ name, contact, proofUrl, message: '', status: '' });
  await alert.save();
  res.status(201).send('Claim submitted');
});

// PATCH claim status and send message
router.patch('/:id/claim/:claimIndex', async (req, res) => {
  const { message, status } = req.body;
  const alert = await Alert.findById(req.params.id);
  if (!alert) return res.status(404).send('Alert not found');

  const claim = alert.claims[req.params.claimIndex];
  if (!claim) return res.status(404).send('Claim not found');

  // Update message and status
  claim.message = message || '';
  claim.status = status;
  await alert.save();

  // Also save a message
  await Message.create({
    to: claim.contact,
    from: alert.contact,
    itemTitle: alert.title,
    itemImage: alert.image,
    itemType: alert.type,
    message,
    status
  });

  // If verified, delete the alert
  if (status === 'verified') {
    await Alert.findByIdAndDelete(req.params.id);
  }

  res.send('Message sent and status updated');
});

module.exports = router;
