require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const alertsRoutes = require('./routes/alerts');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/messages', require('./routes/messages'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
