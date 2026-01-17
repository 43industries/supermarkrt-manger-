# 🧪 Test Login Guide

## ✅ Server Status

The server should be starting. Once it's ready, you can test the login.

---

## 🚀 How to Test

### Step 1: Open the System

Open your browser and go to:
```
http://localhost:3000
```

Or directly:
```
http://localhost:3000/complete-system.html
```

---

### Step 2: Test Admin Login

**Login Credentials:**
- **Username:** `admin`
- **Password:** `Emma@123`

**What to check:**
- ✅ Login form appears
- ✅ Can enter username and password
- ✅ Login button works
- ✅ Successfully logs in
- ✅ Shows admin dashboard
- ✅ All menus visible (Admin has full access)

---

### Step 3: Test Cashier Logins

**Samuel (Cashier):**
- **Username:** `samuel`
- **Password:** `samuel123`

**Michael (Cashier):**
- **Username:** `michael`
- **Password:** `michael123`

**What to check:**
- ✅ Can login with cashier accounts
- ✅ Only sees POS menu (restricted access)
- ✅ Automatically redirected to POS view
- ✅ Cannot access admin features

---

### Step 4: Test Features

**As Admin:**
- ✅ View dashboard
- ✅ Access all menus
- ✅ Manage products
- ✅ View reports
- ✅ Manage users
- ✅ View activity logs

**As Cashier:**
- ✅ Access POS only
- ✅ Make sales
- ✅ Search products
- ✅ Complete transactions
- ❌ Cannot access admin features

---

### Step 5: Test PIN Protection (Void Sales)

1. Make a test sale
2. Try to void the sale
3. Should prompt for PIN
4. Enter password: `Emma@123` (for admin) or `samuel123`/`michael123` (for cashiers)
5. Should void successfully
6. Stock should be restored

---

## 🐛 Troubleshooting

### Server Not Starting?

Check if port 3000 is in use:
```bash
netstat -ano | findstr :3000
```

Or try a different port:
```bash
set PORT=3001 && npm start
```

### Can't Login?

1. **Check database has users:**
   ```bash
   node add-users.js
   ```

2. **Verify password in database:**
   ```bash
   node change-password.js admin Emma@123
   ```

3. **Check browser console (F12)** for errors

4. **Clear browser cache** and try again

### Password Not Working?

- Make sure you're using: `admin` / `Emma@123`
- Check for typos (case-sensitive)
- Try clearing browser localStorage
- Restart the server

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Login form appears
- [ ] Admin login works (`admin` / `Emma@123`)
- [ ] Samuel login works (`samuel` / `samuel123`)
- [ ] Michael login works (`michael` / `michael123`)
- [ ] Cashiers only see POS menu
- [ ] Admin sees all menus
- [ ] Can make a sale
- [ ] Can void a sale (with PIN)
- [ ] Stock updates correctly

---

## 🎯 Quick Test Commands

**Check if server is running:**
```bash
curl http://localhost:3000/api/health
```

**Test login via API:**
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"Emma@123\"}"
```

**Check users in database:**
```bash
node -e "const sqlite3 = require('sqlite3').verbose(); const db = new sqlite3.Database('./supermarket.db'); db.all('SELECT username, name, role FROM users', (err, rows) => { if (err) console.log('Error:', err.message); else rows.forEach(u => console.log(u.username + ' - ' + u.name + ' (' + u.role + ')')); db.close(); });"
```

---

**Ready to test!** Open http://localhost:3000 and try logging in! 🚀
