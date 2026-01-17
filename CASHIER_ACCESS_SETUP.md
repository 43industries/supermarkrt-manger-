# 👥 Cashier Access & Admin Management Setup

This guide explains the complete user management system with role-based access control, PIN protection, and admin notifications.

## ✅ What's Been Implemented

- **✅ User Management System** - Database-driven users with roles
- **✅ Two Cashier Accounts** - Samuel and Michael (POS only)
- **✅ Admin Account** - Full access to everything
- **✅ Role-Based Access Control** - Cashiers see only POS, Admin sees all
- **✅ Activity Logging** - All actions are tracked
- **✅ PIN Protection** - PIN required for void sales
- **✅ Admin Notifications** - Real-time alerts for critical actions
- **✅ Stock Update Tracking** - All stock changes logged

---

## 👤 Default User Accounts

The system comes pre-configured with three users:

### 1. Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Full access to all features

### 2. Samuel (Cashier)
- **Username:** `samuel`
- **Password:** `samuel123`
- **Role:** Cashier
- **Access:** POS only (Point of Sale)

### 3. Michael (Cashier)
- **Username:** `michael`
- **Password:** `michael123`
- **Role:** Cashier
- **Access:** POS only (Point of Sale)

---

## 🔐 Login & Authentication

### Login API
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

---

## 🎯 Role-Based Access Control

### Cashier Access (Samuel & Michael)

**What Cashiers Can Access:**
- ✅ Point of Sale (POS) - Main selling interface
- ✅ Product search (for adding to cart)
- ✅ Customer search (for sales)
- ✅ Basic dashboard (sales metrics only)

**What Cashiers CANNOT Access:**
- ❌ Product management (add/edit/delete products)
- ❌ Stock management
- ❌ Reports (full reports)
- ❌ User management
- ❌ Finance/Expenses
- ❌ Settings
- ❌ Activity logs
- ❌ Admin notifications

### Admin Access

**What Admin Can Access:**
- ✅ Everything
- ✅ Full dashboard with all metrics
- ✅ Product management
- ✅ Stock management
- ✅ All reports
- ✅ User management
- ✅ Activity logs
- ✅ Admin notifications
- ✅ Finance/Expenses management
- ✅ Settings

---

## 🔒 PIN Protection for Void Sales

Void sales now require PIN verification:

### Void Sale Endpoint
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
5. **Admin notification is created** (for phone alerts)

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
  alert(`Sale #${saleId} voided successfully.`);
  return result;
}
```

---

## 📊 Activity Logging

All system activities are automatically logged:

### Logged Activities
- `LOGIN` - User login
- `LOGIN_FAILED` - Failed login attempts
- `VOID_SALE` - Sale voided
- `VOID_SALE_FAILED` - Failed void attempts (wrong PIN)
- `STOCK_UPDATE` - Stock quantity changed
- `STOCK_ADD` - Stock added
- `SALE_CREATED` - New sale created
- `RETURN_CREATED` - Return processed
- `USER_UPDATED` - User information updated
- `PIN_VERIFIED` - PIN verification successful
- `PIN_FAILED` - PIN verification failed

### Get Activity Logs (Admin Only)
```http
GET /api/activity-logs
```

**Query Parameters:**
- `userId` - Filter by user
- `action` - Filter by action type
- `startDate` - Start date filter
- `endDate` - End date filter
- `limit` - Number of logs (default: 100)
- `offset` - Pagination offset

**Example:**
```javascript
// Get all activities
fetch('/api/activity-logs')
  .then(res => res.json())
  .then(logs => {
    logs.forEach(log => {
      console.log(`${log.created_at} - ${log.action} - ${log.description}`);
    });
  });

// Get activities for specific cashier
fetch('/api/activity-logs?userId=2')
  .then(res => res.json())
  .then(logs => console.log(logs));

// Get void sale activities
fetch('/api/activity-logs?action=VOID_SALE')
  .then(res => res.json())
  .then(logs => console.log(logs));
```

---

## 🔔 Admin Notifications

Admin receives notifications for critical activities:

### Notification Types
- `VOID_SALE` - When a sale is voided (requires admin attention)
- `STOCK_UPDATE` - Significant stock changes
- `SECURITY` - Security events (failed PIN attempts, etc.)
- `RETURN` - Returns processed
- `SYSTEM` - System events

### Get Notifications
```http
GET /api/admin/notifications
```

**Query Parameters:**
- `unreadOnly` - Only unread notifications (default: false)
- `limit` - Number of notifications (default: 100)

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

**Example:**
```javascript
// Get unread notifications
fetch('/api/admin/notifications?unreadOnly=true')
  .then(res => res.json())
  .then(notifications => {
    if (notifications.length > 0) {
      console.log(`You have ${notifications.length} unread notifications`);
      // Show notification badge
      // Send to phone (if integrated)
    }
  });
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

## 📱 Phone Alerts for Admin

The notification system is ready for phone alerts. Here's how to integrate:

### Option 1: SMS Integration (Recommended for Kenya)

Use **AfricasTalking SMS API**:

```javascript
// In server.js, add to package.json:
// npm install africastalking

const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME
});

// Modify createAdminNotification function:
function createAdminNotification(db, type, title, message, actionType, actionId, priority, requiresAction) {
  // Create notification in database
  db.run(/* ... */, function(err) {
    if (!err && priority === 'high' && requiresAction) {
      // Get admin phone from users table
      db.get('SELECT phone FROM users WHERE role = "Admin" LIMIT 1', [], (err, admin) => {
        if (admin && admin.phone) {
          // Send SMS
          at.SMS.send({
            to: admin.phone,
            message: `${title}: ${message}`
          });
        }
      });
    }
  });
}
```

### Option 2: WhatsApp Business API

Use **Twilio WhatsApp API** or **360dialog**:

```javascript
// Similar to SMS but using WhatsApp
at.SMS.send({
  to: `whatsapp:${admin.phone}`,
  message: `${title}: ${message}`
});
```

### Option 3: Push Notifications

Use **Firebase Cloud Messaging** for mobile app integration.

---

## 📦 Stock Update Tracking

All stock changes are automatically logged:

### When Stock is Updated:
1. **Activity Log Created** - Records who, what, when
2. **Admin Notification** - For significant changes (>50 units)
3. **Timestamp Recorded** - Exact time of change

**Example Notification:**
```
Title: "Large Stock Addition"
Message: "100 units of Rice 5kg added. New stock: 150"
Type: STOCK_UPDATE
Priority: normal
```

---

## 🎯 Frontend Implementation

### 1. Cashier View (POS Only)

When cashier logs in, restrict access:

```javascript
// After login
if (user.role === 'Cashier') {
  setCurrentView('pos'); // Only show POS
  // Hide navigation for other sections
  setShowProductsManagement(false);
  setShowReports(false);
  setShowSettings(false);
  // Only show POS and basic dashboard
}
```

### 2. PIN Input for Void Sales

```javascript
function handleVoidSale(saleId) {
  // Prompt for PIN
  const pin = prompt('Enter your PIN to void this sale:');
  if (!pin) return;
  
  // Verify and void
  fetch(`/api/sales/${saleId}/void`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.id,
      pin: pin
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Sale voided successfully. Stock restored.');
        // Refresh sales list
      } else {
        alert('Void failed: Invalid PIN');
      }
    })
    .catch(err => {
      alert('Error: ' + err.message);
    });
}
```

### 3. Admin Notification Display

```javascript
// Fetch notifications periodically (every 30 seconds)
useEffect(() => {
  if (currentUser && currentUser.role === 'Admin') {
    const interval = setInterval(() => {
      fetch('/api/admin/notifications?unreadOnly=true')
        .then(res => res.json())
        .then(notifications => {
          if (notifications.length > 0) {
            // Show notification badge
            setUnreadCount(notifications.length);
            // Show notification list
            setNotifications(notifications);
            // Optionally: Show alert for high-priority notifications
            notifications.forEach(notif => {
              if (notif.priority === 'high') {
                alert(`${notif.title}: ${notif.message}`);
              }
            });
          }
        });
    }, 30000);
    
    return () => clearInterval(interval);
  }
}, [currentUser]);
```

---

## 🔧 Managing Users

### Change Password
```javascript
fetch(`/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    password: 'newpassword123'
  })
});
```

### Set PIN (for quick void operations)
```javascript
fetch(`/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pin: '1234' // 4-digit PIN for quick entry
  })
});
```

### Update User Info
```javascript
fetch(`/api/users/${userId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Samuel Mwangi',
    phone: '+254712345678',
    email: 'samuel@example.com'
  })
});
```

---

## 📋 Quick Setup Checklist

- [x] Database tables created (users, activity_logs, admin_notifications)
- [x] Default users created (admin, samuel, michael)
- [x] Authentication API endpoints ready
- [x] Activity logging working
- [x] PIN protection for void sales
- [x] Admin notifications system ready
- [ ] Frontend updated to use new authentication (needs frontend update)
- [ ] Role-based UI restrictions (needs frontend update)
- [ ] Phone alerts integration (optional - configure as needed)

---

## 🎯 Next Steps

1. **Update Frontend** - Modify login to use `/api/auth/login`
2. **Implement Role-Based UI** - Hide menus for cashiers
3. **Add PIN Input** - For void sales in frontend
4. **Add Notification Display** - Show notifications to admin
5. **Configure Phone Alerts** - Set up SMS/WhatsApp integration (optional)

---

## 📚 Related Documentation

- [User Management Guide](./USER_MANAGEMENT_GUIDE.md)
- [Returns System Guide](./RETURNS_SYSTEM_GUIDE.md)
- [Finance System Guide](./FINANCE_SYSTEM_GUIDE.md)

---

Need help? Check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
