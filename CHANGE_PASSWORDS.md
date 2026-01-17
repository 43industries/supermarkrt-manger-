# 🔐 Change User Passwords

## Quick Password Change

Use the `change-password.js` script to change any user's password.

### Usage:

```bash
node change-password.js <username> <newpassword>
```

### Examples:

**Change admin password:**
```bash
node change-password.js admin MyNewAdminPassword123
```

**Change samuel password:**
```bash
node change-password.js samuel NewSamuelPassword456
```

**Change michael password:**
```bash
node change-password.js michael NewMichaelPassword789
```

---

## 📋 Current Default Passwords

- **admin** / admin123
- **samuel** / samuel123  
- **michael** / michael123

---

## 🔧 Change All Passwords at Once

You can change all three passwords:

```bash
# Change admin password
node change-password.js admin YourAdminPassword

# Change samuel password
node change-password.js samuel SamuelPassword123

# Change michael password
node change-password.js michael MichaelPassword456
```

---

## ✅ After Changing Password

1. **Login with new password:**
   - Open: http://localhost:3000
   - Use your new username/password

2. **Test it works:**
   - Make sure you can login
   - Try different actions to verify access

3. **Write down new passwords:**
   - Keep them in a safe place
   - Don't forget them!

---

## 🆘 Troubleshooting

### Script doesn't run?
- Make sure Node.js is installed: `node --version`
- Make sure you're in the project folder
- Make sure `supermarket.db` exists

### Password still not working?
- Make sure server is running: `npm start`
- Check browser console (F12) for errors
- Verify password was changed (run script again with new password)

### User not found?
- Run: `node add-users.js` to add users first
- Check available users with the script error message

---

## 💡 Tips

- Use strong passwords (8+ characters, mix of letters/numbers)
- Don't use default passwords in production
- Change admin password first
- Write down passwords in a secure location

---

## 🎯 Quick Commands Reference

```bash
# Change admin password to "MyAdmin123"
node change-password.js admin MyAdmin123

# Change samuel password to "Samuel2025"
node change-password.js samuel Samuel2025

# Change michael password to "Michael2025"
node change-password.js michael Michael2025
```
