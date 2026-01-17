# 🔐 Update Offline System Password

## ✅ Password Updated!

The admin password in `complete-system-offline.html` has been updated to:
- **Username:** `admin`
- **Password:** `Emma@123`

---

## ⚠️ Important Note

If you've **already used the offline system** before, the old password might still be saved in your browser's localStorage. Here's how to fix it:

### Option 1: Clear localStorage (Resets to New Password)

1. Open the offline system in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type this command:
   ```javascript
   localStorage.removeItem('storeUsers');
   localStorage.removeItem('logged_in_user');
   ```
5. Press **Enter**
6. **Refresh the page** (F5)
7. The new password (`Emma@123`) will now be active!

### Option 2: Update Existing localStorage (Keep Data)

1. Open the offline system in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type this command:
   ```javascript
   const users = JSON.parse(localStorage.getItem('storeUsers') || '[]');
   const updatedUsers = users.map(u => 
     u.username === 'admin' ? { ...u, password: 'Emma@123' } : u
   );
   localStorage.setItem('storeUsers', JSON.stringify(updatedUsers));
   console.log('✅ Password updated! Refresh the page.');
   ```
5. Press **Enter**
6. **Refresh the page** (F5)
7. Login with: `admin` / `Emma@123`

---

## 📋 New Login Credentials

**Admin:**
- Username: `admin`
- Password: `Emma@123`

**Cashier:**
- Username: `cashier`
- Password: `cashier123`

---

## 🎯 For New Users

If someone uses the offline system for the **first time**, they will automatically get:
- Admin password: `Emma@123` ✅
- The defaultUsers array has been updated

---

## 📝 Summary

✅ Updated `defaultUsers` array in `complete-system-offline.html`
✅ Updated displayed credentials on login screen
✅ New users will get `Emma@123` automatically
⚠️ Existing users need to clear/update localStorage (see options above)

---

**The offline system now uses `Emma@123` as the admin password!** 🎉
