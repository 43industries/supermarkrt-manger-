# Connection Refused - Fix Guide

## Problem: "Connection Refused" in Browser

**Cause:** Server is not running on port 3000

---

## Quick Fix:

### Step 1: Start the Server

**Option A: Use Auto Start Script (Easiest)**
- Double-click: `AUTO_START.bat`
- Wait for: "Server running on http://localhost:3000"

**Option B: Manual Start**
1. Open Command Prompt in project folder
2. Run: `"C:\Program Files\nodejs\node.exe" server.js`
3. Wait for server to start

### Step 2: Verify Server is Running

Look for this message:
```
🚀 Server running on http://localhost:3000
📊 Database initialized and ready
```

### Step 3: Open Browser

Go to: `http://localhost:3000/app.html`

**NOT:** `http://localhost:3000` (missing /app.html)
**NOT:** `file:///` (file protocol won't work)

---

## Common Mistakes:

### ❌ Wrong URL:
- `http://localhost:3000` (no page specified)
- `file:///E:/supermarket system/app.html` (file protocol)
- `localhost:3000` (missing http://)

### ✅ Correct URL:
- `http://localhost:3000/app.html`
- `http://127.0.0.1:3000/app.html`

---

## Check if Server is Running:

### Method 1: Check Port
```bash
netstat -ano | findstr :3000
```
Should show port 3000 LISTENING

### Method 2: Check Node Process
```bash
tasklist | findstr node
```
Should show node.exe processes

### Method 3: Try Connection
Open browser and go to: `http://localhost:3000/app.html`

---

## If Server Won't Start:

### Error: "Cannot find module"
→ Dependencies not installed
→ Run: `FIX_AND_START.bat`

### Error: "Port 3000 already in use"
→ Another server running
→ Close it or change port in server.js

### Error: "EADDRINUSE"
→ Port conflict
→ Kill process: `taskkill /F /IM node.exe`
→ Then restart server

---

## Step-by-Step Solution:

1. **Open Command Prompt** in project folder
2. **Check if server is running:**
   ```bash
   netstat -ano | findstr :3000
   ```
   If empty → server not running

3. **Start the server:**
   ```bash
   "C:\Program Files\nodejs\node.exe" server.js
   ```

4. **Wait for:**
   ```
   🚀 Server running on http://localhost:3000
   ```

5. **Open browser:**
   ```
   http://localhost:3000/app.html
   ```

---

## Still Not Working?

1. **Check firewall** - might be blocking port 3000
2. **Try different port** - edit server.js, change PORT to 3001
3. **Check browser console** (F12) for errors
4. **Try different browser** (Chrome, Firefox, Edge)

---

## Quick Test:

After starting server, test with:
```
http://localhost:3000/app.html
```

If you see login page → Server is working! ✅
If connection refused → Server not started ❌

