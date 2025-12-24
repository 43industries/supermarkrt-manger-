# How to Start the System - Step by Step

## 🚀 Quick Start (Choose Your Method)

---

## Method 1: With Database (Recommended) - Multi-Device Support

### Step 1: Install Node.js (First Time Only)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Install it (just click Next, Next, Next)

2. **Restart your computer** after installation

3. **Verify installation:**
   - Open Command Prompt
   - Type: `node --version`
   - Should show something like: `v18.x.x`

### Step 2: Install Dependencies (First Time Only)

1. **Open Command Prompt** in the project folder:
   - Press `Shift + Right-click` in the folder
   - Select "Open PowerShell window here" or "Open Command Prompt here"

2. **Run this command:**
   ```bash
   npm install
   ```
   - Wait for it to finish (may take 1-2 minutes)

### Step 3: Start the Server

**Option A: Double-Click (Easiest)**
- Double-click `START_SERVER.bat`
- A window will open showing the server starting

**Option B: Command Line**
- Open Command Prompt in the project folder
- Type: `npm start`
- Press Enter

### Step 4: Open the Application

1. **Wait for this message:**
   ```
   🚀 Server running on http://localhost:3000
   📊 Database initialized and ready
   ```

2. **Open your web browser** (Chrome, Firefox, Edge, etc.)

3. **Go to:**
   ```
   http://localhost:3000/app.html
   ```

4. **Login:**
   - Username: `admin`
   - Password: `admin123`

**That's it! The system is running!** ✅

---

## Method 2: Without Database (Simple - Single Device)

### If you don't have Node.js installed:

1. **Double-click:** `START_SIMPLE_SERVER.bat`
   - OR use Python: `python -m http.server 8000`

2. **Open browser:**
   ```
   http://localhost:8000/test-app.html
   ```

3. **Login:**
   - Username: `admin`
   - Password: `admin123`

**Note:** This uses localStorage (browser storage) - data only on one device.

---

## 📋 What You'll See

### When Server Starts:
```
🚀 Server running on http://localhost:3000
📊 Database initialized and ready

🌐 Network Access:
   Local:    http://localhost:3000
   Network:  http://192.168.x.x:3000

💡 Other devices on your network can access:
   http://192.168.x.x:3000/app.html
```

### In Your Browser:
- Login screen appears
- Enter credentials
- Dashboard loads with all features

---

## ✅ Checklist

Before starting:
- [ ] Node.js installed? (Check: `node --version`)
- [ ] Dependencies installed? (Check: `node_modules` folder exists)
- [ ] Port 3000 available? (Close other apps using port 3000)

To start:
- [ ] Run `START_SERVER.bat` or `npm start`
- [ ] Wait for "Server running" message
- [ ] Open browser to `http://localhost:3000/app.html`
- [ ] Login with admin/admin123

---

## 🐛 Troubleshooting

### "Node.js not found"
- **Solution:** Install Node.js from https://nodejs.org/
- Restart computer after installation

### "Port 3000 already in use"
- **Solution:** Close other applications
- OR change port in `server.js` (line 7): `const PORT = 3001;`

### "Cannot find module"
- **Solution:** Run `npm install` in the project folder

### "Server starts but browser shows error"
- **Solution:** 
  1. Make sure server is running (check the window)
  2. Use exact URL: `http://localhost:3000/app.html`
  3. Check browser console (F12) for errors

### "Blank page"
- **Solution:**
  1. Check browser console (F12)
  2. Make sure you're using a web server (not opening file:// directly)
  3. Try a different browser

---

## 🎯 Quick Reference

| Action | Command/File |
|--------|-------------|
| **Start Server** | `START_SERVER.bat` or `npm start` |
| **Open App** | `http://localhost:3000/app.html` |
| **Login** | `admin` / `admin123` |
| **Stop Server** | Press `Ctrl+C` in the server window |

---

## 📱 For Multiple Devices

Once server is running:

1. **Note the IP address** shown in server console
   - Example: `192.168.1.100`

2. **On other devices** (same WiFi):
   - Open: `http://192.168.1.100:3000/app.html`
   - Login with same credentials

See `MULTI_DEVICE_SETUP.md` for details.

---

## 🎉 You're Ready!

Follow Method 1 for the best experience with database and multi-device support!

**Need help?** Check the browser console (F12) for error messages.

