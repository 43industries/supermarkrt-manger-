# Debugging Loading Errors

## How to Check Console for Errors

### Step 1: Open Browser Console

1. **Press F12** on your keyboard
   - OR right-click page → Select "Inspect" or "Inspect Element"
   - OR press `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

2. **Click on the "Console" tab**

### Step 2: Look for Error Messages

Check for messages with these icons/colors:
- ❌ **Red errors** - Critical problems
- ⚠️ **Yellow warnings** - Non-critical issues
- ℹ️ **Blue info** - Informational messages

### Step 3: Common Error Types

#### "Failed to fetch" or "Network Error"
**Problem:** Server not running or connection issue
**Solution:**
- Make sure server is running (`START_OPTIMIZED.bat`)
- Check server URL is correct
- Verify firewall allows connection

#### "app.js not found" or "404 Not Found"
**Problem:** File not found
**Solution:**
- Make sure `app.js` is in the same folder
- Check you're accessing via server (not file://)
- Use: `http://localhost:3000/app.html`

#### "React is not defined"
**Problem:** React library didn't load
**Solution:**
- Check internet connection (needed for CDN)
- Check browser console for blocked resources
- Try refreshing page

#### "Syntax Error" or "Unexpected token"
**Problem:** JavaScript syntax error
**Solution:**
- Check console for line number
- Verify app.js file is not corrupted
- Try restarting server

---

## What the Console Should Show (Normal Operation)

When everything works correctly, you should see:

```
✅ app.js loaded successfully
✅ App initialized successfully
🔄 Starting data load...
📍 API Base URL: http://localhost:3000
🌐 Attempting to fetch data from API...
📦 Products API response: 200 OK
🏢 Suppliers API response: 200 OK
💰 Sales API response: 200 OK
👥 Customers API response: 200 OK
✅ API data fetched successfully
📊 Data counts: {products: X, suppliers: X, sales: X, customers: X}
✅ Data loaded from API successfully
🏁 Data loading complete
```

---

## What Error Messages Mean

### Error Messages in Console

#### `API Connection Failed: ...`
- **Meaning:** Cannot connect to server
- **Check:**
  - Server running? (`START_OPTIMIZED.bat`)
  - Correct URL? (`http://localhost:3000`)
  - Firewall blocking?

#### `Loading Error: ...`
- **Meaning:** General loading problem
- **Check:**
  - Check full error message
  - Look at error stack trace
  - Verify file permissions

#### `File Not Found` or `404`
- **Meaning:** Missing file
- **Check:**
  - File exists in folder?
  - Using correct URL?
  - Server serving files correctly?

---

## Debugging Steps

### Step 1: Check Server Status
1. Open server console (where `START_OPTIMIZED.bat` is running)
2. Look for: `🚀 Server running on http://localhost:3000`
3. If not running, start server

### Step 2: Test Server Directly
1. Open browser
2. Go to: `http://localhost:3000/api/products`
3. Should see JSON data (not error page)

### Step 3: Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Note the error message

### Step 4: Check Network Tab
1. Press F12
2. Go to Network tab
3. Refresh page
4. Look for:
   - Red entries (failed requests)
   - Check status codes (200 = OK, 404 = Not Found, etc.)

### Step 5: Check File Structure
Make sure these files exist:
- `app.js`
- `app.html`
- `server.js`
- `database.js`
- `package.json`
- `node_modules/` folder

---

## Quick Fixes

### Problem: Blank Page
**Quick Fix:**
1. Open browser console (F12)
2. Check for errors
3. Make sure server is running
4. Try: `http://localhost:3000/app.html`

### Problem: "Connection Refused"
**Quick Fix:**
1. Start server: `START_OPTIMIZED.bat`
2. Wait for server to start
3. Refresh browser page

### Problem: "Cannot read property..."
**Quick Fix:**
1. Check console for exact error
2. Note line number
3. May be data format issue
4. Try clearing browser cache

### Problem: Slow Loading
**Quick Fix:**
1. Check server console for errors
2. Verify database file exists
3. Check available memory
4. Close other applications

---

## Getting Help

When reporting errors, include:

1. **Error message** from console
2. **Screenshot** of console (F12)
3. **Server status** (running or not)
4. **URL** you're accessing
5. **Browser** you're using
6. **Steps** to reproduce

---

## Error Log Locations

### Browser Console
- Press F12 → Console tab
- All JavaScript errors appear here

### Server Console
- Command Prompt window running `START_OPTIMIZED.bat`
- Server errors appear here

### Network Log
- Press F12 → Network tab
- Shows all HTTP requests/responses

---

**Remember:** The console is your friend! It shows exactly what's wrong. Always check it first when something doesn't work.

