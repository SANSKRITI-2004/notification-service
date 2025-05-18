// queues/notificationQueue.js
const { Queue } = require('bullmq');

const notificationQueue = new Queue('notificationQueue', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
  }
});

module.exports = notificationQueue;
