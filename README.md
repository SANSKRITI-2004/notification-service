# Notification Service

## Objective
Build a system to send notifications to users using MongoDB and Node.js.

---

##  Features

- Send notifications via Email, SMS, or In-App.
- View notifications for a user.
- JSON-based API endpoints.
- Built with Express, MongoDB, and Mongoose.

---

##  API Endpoints

### ➤ `POST /notifications`
Send a notification.

**Body (JSON):**
```json
{
  "userId": "user123",
  "type": "email",
  "message": "This is a test message"
}
