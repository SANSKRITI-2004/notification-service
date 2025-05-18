const notificationQueue = require('./queues/notificationQueue');

async function addJob() {
  await notificationQueue.add('sendNotification', {
    notificationId: '123abc',
    userId: 'user123',
    type: 'email',
    message: 'Hello from job producer!',
  });
  console.log('✅ Job added to notificationQueue');
  process.exit(0);
}

addJob().catch(console.error);
