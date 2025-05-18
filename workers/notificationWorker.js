// workers/notificationWorker.js
const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Ensure MongoDB is connected
mongoose.connect('mongodb://localhost:27017/notification_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected (worker)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the worker
const worker = new Worker('notificationQueue', async job => {
  const { notificationId, userId, type, message } = job.data;

  try {
    console.log(`🚀 Sending ${type} to user ${userId}: ${message}`);
    await Notification.findByIdAndUpdate(notificationId, { status: 'sent' });
    console.log(`✅ Notification ${notificationId} marked as sent.`);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    await Notification.findByIdAndUpdate(notificationId, { status: 'failed' });
    throw error; // this causes job retry if configured
  }
}, {
  connection: {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
  }
});

console.log('✅ Worker is running and listening for jobs...');
