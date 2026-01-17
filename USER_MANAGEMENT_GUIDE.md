# 👥 User Management & Access Control Guide

This guide explains the user management system, role-based access control, activity logging, and admin notifications.

## ✅ What's Been Implemented

- **✅ User Management** - Database-driven user accounts
- **✅ Two Cashier Accounts** - Samuel and Michael
- **✅ Role-Based Access Control** - Cashiers see only POS, Admin sees everything
- **✅ Activity Logging** - All system activities are logged
- **✅ PIN Protection** - PIN/password required for void sales
- **✅ Admin Notifications** - Real-time alerts for critical actions
- **✅ Stock Update Tracking** - All stock changes are logged

---

## 👤 Default Users

The system comes with three default users:

1. **Admin**
   - Username: `admin`
   - Password: `admin123`
   - Role: Admin (full access)

2. **Samuel (Cashier)**
   - Username: `samuel`
   - Password: `samuel123`
   - Role: Cashier (POS only)

3. **Michael (Cashier)**
   - Username: `michael`
   - Password: `michael123`
   - Role: Cashier (POS only)

---

## 🔐 Authentication API

### Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "username": "samuel",
  "password": "samuel123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "samuel",
    "name": "Samuel",
    "role": "Cashier",
    "active": 1
  },
  "token": "session_token_1234567890"
}
```

### Verify PIN
```http
POST /api/auth/verify-pin
Content-Type: application/json
```

**Request:**
```json
{
  "userId": 2,
  "pin": "samuel123"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true
}
```

---

## 📋 User Management API

### Get All Users
```http
GET /api/users
```

### Get User by ID
```http
GET /api/users/:id
```

### Update User
```http
PUT /api/users/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "newpassword123",
  "pin": "1234",
  "name": "Samuel Mwangi",
  "phone": "+254712345678",
  "email": "samuel@example.com",
  "active": 1
}
```

---

## 📊 Activity Logging

All system activities are automatically logged:

### Activity Types
- `LOGIN` - User login
- `LOGIN_FAILED` - Failed login attempt
- `VOID_SALE` - Sale voided
- `VOID_SALE_FAILED` - Failed void attempt
- `STOCK_UPDATE` - Stock quantity changed
- `STOCK_ADD` - Stock added
- `SALE_CREATED` - New sale created
- `RETURN_CREATED` - Return processed
- `USER_UPDATED` - User information updated
- `PIN_VERIFIED` - PIN verification successful
- `PIN_FAILED` - PIN verification failed

### Get Activity Logs
```http
GET /api/activity-logs
```

**Query Parameters:**
- `limit` (default: 100) - Number of logs to return
- `offset` (default: 0) - Pagination offset
- `userId` - Filter by user ID
- `action` - Filter by action type
- `startDate` - Start date filter (YYYY-MM-DD)
- `endDate` - End date filter (YYYY-MM-DD)

**Example:**
```javascript
// Get all activities
fetch('/api/activity-logs')
  .then(res => res.json())
  .then(data => console.log(data));

// Get activities for specific user
fetch('/api/activity-logs?userId=2')
  .then(res => res.json())
  .then(data => console.log(data));

// Get void sale activities
fetch('/api/activity-logs?action=VOID_SALE')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🔔 Admin Notifications

Admin receives notifications for critical activities:

### Notification Types
- `VOID_SALE` - When a sale is voided
- `STOCK_LOW` - When stock is low
- `SECURITY` - Security-related events (failed PIN, etc.)
- `STOCK_UPDATE` - Significant stock changes
- `RETURN` - Returns processed
- `SYSTEM` - System events

### Get Notifications
```http
GET /api/admin/notifications
```

**Query Parameters:**
- `unreadOnly` (default: false) - Only unread notifications
- `limit` (default: 100) - Number of notifications

**Response:**
```json
[
  {
    "id": 1,
    "type": "VOID_SALE",
    "title": "Sale Voided",
    "message": "Sale #123 (KES 650) was voided by Samuel",
    "action_type": "sale",
    "action_id": 123,
    "priority": "high",
    "read": 0,
    "requires_action": 1,
    "created_at": "2025-01-15 10:30:00"
  }
]
```

### Mark Notification as Read
```http
PUT /api/admin/notifications/:id/read
```

### Mark All as Read
```http
PUT /api/admin/notifications/read-all
```

---

## 🚫 Void Sale with PIN Protection

Void sales now require PIN verification:

```http
POST /api/sales/:id/void
Content-Type: application/json
```

**Request:**
```json
{
  "userId": 2,
  "pin": "samuel123"
}
```

**What Happens:**
1. PIN is verified
2. If valid, sale is voided
3. Stock is restored
4. Activity is logged
5. Admin notification is created

**Example:**
```javascript
async function voidSale(saleId, userId, pin) {
  const response = await fetch(`/api/sales/${saleId}/void`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pin })
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (error.error === 'Invalid PIN') {
      alert('Invalid PIN. Void operation cancelled.');
      return;
    }
    throw new Error(error.error);
  }
  
  const result = await response.json();
  alert(`Sale #${saleId} voided successfully. Stock restored.`);
  return result;
}
```

---

## 📱 Phone Alerts Integration

The notification system is ready for phone alerts. To integrate:

### Option 1: SMS Integration (Recommended)
Use services like:
- **Twilio** - SMS API
- **AfricasTalking** - SMS for Kenya
- **Safaricom SMS API**

**Example with AfricasTalking:**
```javascript
// In server.js, when creating notification:
const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: 'YOUR_API_KEY',
  username: 'YOUR_USERNAME'
});

// Send SMS when high-priority notification is created
if (priority === 'high' && requiresAction) {
  at.SMS.send({
    to: adminPhone, // Get from users table
    message: `${title}: ${message}`
  });
}
```

### Option 2: Push Notifications
- Use **Firebase Cloud Messaging (FCM)**
- Use **OneSignal**
- Use **Pusher**

### Option 3: WhatsApp Business API
- Use **Twilio WhatsApp API**
- Use **360dialog**
- Use **WhatsApp Business API**

---

## 🎯 Role-Based Access Control

### Cashier Access (Samuel & Michael)
**Can Access:**
- ✅ Point of Sale (POS)
- ✅ Customer search (for sales)
- ✅ Basic dashboard (sales metrics only)

**Cannot Access:**
- ❌ Product management
- ❌ Stock management
- ❌ Reports (full)
- ❌ User management
- ❌ Finance/Expenses
- ❌ Settings

### Admin Access
**Can Access:**
- ✅ Everything
- ✅ All reports
- ✅ User management
- ✅ Activity logs
- ✅ Notifications
- ✅ Stock management
- ✅ Product management
- ✅ Finance management

---

## 📝 Implementation Notes for Frontend

### 1. Cashier View (POS Only)
When cashier logs in, redirect to POS view only:

```javascript
if (user.role === 'Cashier') {
  setCurrentView('pos'); // Only show POS
  // Hide all other menu items
}
```

### 2. PIN Input for Void Sales
```javascript
function handleVoidSale(saleId) {
  const pin = prompt('Enter your PIN to void this sale:');
  if (!pin) return;
  
  voidSale(saleId, currentUser.id, pin)
    .then(() => {
      // Refresh sales list
    })
    .catch(err => {
      alert('Void failed: ' + err.message);
    });
}
```

### 3. Admin Notification Display
```javascript
// Fetch notifications periodically
setInterval(() => {
  fetch('/api/admin/notifications?unreadOnly=true')
    .then(res => res.json())
    .then(notifications => {
      if (notifications.length > 0) {
        // Show notification badge
        // Show notification list
        // Optionally: Send to phone (if integrated)
      }
    });
}, 30000); // Every 30 seconds
```

### 4. Activity Log Display (Admin)
```javascript
// Show activity logs in admin dashboard
fetch('/api/activity-logs?limit=50')
  .then(res => res.json())
  .then(logs => {
    // Display in activity log table
    // Show: timestamp, user, action, description
  });
```

---

## 🔧 Configuration

### Setting PIN for Users
Users can have a separate PIN (different from password) for sensitive operations:

```javascript
// Update user to set PIN
fetch(`/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pin: '1234' // 4-digit PIN for quick entry
  })
});
```

If PIN is not set, password is used as PIN.

---

## 📊 Stock Update Tracking

All stock changes automatically create activity logs:

- When stock is added → `STOCK_ADD` log
- When stock is updated → `STOCK_UPDATE` log
- When stock is reduced (sale) → `STOCK_UPDATE` log

Admin notifications are created for:
- Large stock additions (>threshold)
- Stock reaching reorder level
- Stock updates by cashiers

---

## 🎯 Best Practices

1. **Change Default Passwords**: Change default passwords immediately
2. **Set PINs**: Set separate PINs for cashiers (4-digit for quick entry)
3. **Monitor Activity Logs**: Regularly review activity logs
4. **Check Notifications**: Admin should check notifications regularly
5. **Phone Integration**: Integrate phone alerts for critical notifications
6. **Regular Backups**: Back up user data and activity logs

---

## 🆘 Troubleshooting

### Issue: "User not found" on login
**Solution:** Check that user exists and is active (`active = 1`)

### Issue: PIN verification always fails
**Solution:** 
- Check that user has PIN set, or password is correct
- PIN is case-sensitive

### Issue: Notifications not appearing
**Check:**
- Notifications are created by the system
- Admin is checking unread notifications
- Database connection is working

### Issue: Activity logs not recording
**Check:**
- Database connection
- Activity logging function is being called
- Check server logs for errors

---

## 📚 Related Documentation

- [Returns System Guide](./RETURNS_SYSTEM_GUIDE.md)
- [Finance System Guide](./FINANCE_SYSTEM_GUIDE.md)
- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)

---

Need help? Check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
