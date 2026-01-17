# 🔐 Password Reset Guide

## ✅ Issue Fixed!

The default users have been added to your database. The passwords are now working!

---

## 📋 Default Login Credentials

### Admin (Full Access)
- **Username:** `admin`
- **Password:** `admin123`

### Samuel (Cashier - POS Only)
- **Username:** `samuel`
- **Password:** `samuel123`

### Michael (Cashier - POS Only)
- **Username:** `michael`
- **Password:** `michael123`

---

## 🔧 If Passwords Still Don't Work

### Option 1: Re-add Users (Quick Fix)

Run this command:
```bash
node add-users.js
```

This will add/update the default users in your database.

---

### Option 2: Change Password via API

If you can login as admin, you can change passwords via the API:

**Update User Password:**
```http
PUT /api/users/:id
Content-Type: application/json
```

**Request:**
```json
{
  "password": "newpassword123"
}
```

**Example (using curl):**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword123"}'
```

---

### Option 3: Direct Database Update (Advanced)

If you have database access:

```sql
UPDATE users SET password = 'newpassword123' WHERE username = 'admin';
```

---

## 🎯 Next Steps

1. **Login with default credentials:**
   - Open: http://localhost:3000
   - Use: `admin` / `admin123`

2. **Change passwords (recommended):**
   - Login as admin
   - Go to user management (when available)
   - Or use API to update passwords

3. **Keep passwords secure:**
   - Change default passwords
   - Use strong passwords
   - Don't share passwords

---

## 🆘 Still Having Issues?

1. **Check if server is running:**
   ```bash
   npm start
   ```

2. **Check database exists:**
   - File: `supermarket.db` should exist

3. **Run the user script again:**
   ```bash
   node add-users.js
   ```

4. **Check browser console:**
   - Press F12
   - Check for errors
   - Look for API errors

---

## ✅ Success!

Your passwords should now work! Try logging in with:
- **admin** / **admin123**
- **samuel** / **samuel123**
- **michael** / **michael123**
