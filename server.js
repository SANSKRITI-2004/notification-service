// server.js
const express = require('express');
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const notificationQueue = require('./queues/notificationQueue');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/notification_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// POST /notifications
app.post('/notifications', async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'userId, type, and message are required' });
    }

    const notification = new Notification({
      userId,
      type,
      message,
      status: 'pending',
      createdAt: new Date()
    });

    await notification.save();

    await notificationQueue.add('sendNotification', {
      notificationId: notification._id,
      userId,
      type,
      message
    });

    res.status(201).json({ message: 'Notification created and queued', notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /users/:id/notifications
app.get('/users/:id/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
