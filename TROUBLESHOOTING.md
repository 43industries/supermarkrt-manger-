# Troubleshooting Guide

## Browser Not Loading - Quick Fixes

### Problem: "Blank page" or "Not loading"

**Solution 1: Use a Web Server (Recommended)**
- Don't open HTML files directly (file://)
- Use one of these methods:

#### Option A: Python (if installed)
```bash
python -m http.server 8000
```
Then open: `http://localhost:8000/test-app.html`

#### Option B: Node.js serve
```bash
npx serve -p 3000
```
Then open: `http://localhost:3000/test-app.html`

#### Option C: Use the batch file
- Double-click `START_SIMPLE_SERVER.bat`
- It will automatically use Python or Node.js

---

### Problem: "CORS error" or "Failed to fetch"

**Cause:** Opening HTML file directly (file:// protocol)

**Solution:** Use a web server (see Solution 1 above)

---

### Problem: "app.js not found"

**Check:**
1. Is `app.js` in the same folder as the HTML file?
2. Are you using a web server? (not opening file:// directly)
3. Check browser console (F12) for exact error

---

### Problem: "React is not defined"

**Cause:** CDN libraries didn't load (no internet or blocked)

**Solution:**
1. Check internet connection
2. Check browser console (F12) for blocked resources
3. Try a different browser
4. Check if antivirus/firewall is blocking CDN

---

### Problem: "Babel transform error"

**Cause:** JSX syntax error or Babel not loaded

**Solution:**
1. Check browser console (F12) for specific error
2. Make sure Babel CDN loaded: `https://unpkg.com/@babel/standalone/babel.min.js`
3. Check if app.js has valid JavaScript/JSX

---

## Step-by-Step Debugging

### 1. Open Browser Console
- Press **F12** in your browser
- Go to **Console** tab
- Look for red error messages

### 2. Check Network Tab
- In browser console, go to **Network** tab
- Refresh the page
- Look for failed requests (red)
- Check if `app.js` loads (should be 200 status)

### 3. Test Files Individually

**Test 1: Check if React loads**
Open browser console and type:
```javascript
typeof React
```
Should return: `"object"`

**Test 2: Check if app.js exists**
Try opening: `http://localhost:8000/app.js` (or your server URL)
Should show the JavaScript code

**Test 3: Check file location**
Make sure these files are in the same folder:
- `test-app.html` (or `standalone.html`)
- `app.js`

---

## Quick Test

1. **Open `test-app.html`** in browser
2. **Press F12** to open console
3. **Look for these messages:**
   - ✅ React loaded: true
   - ✅ ReactDOM loaded: true
   - ✅ Babel loaded: true
   - ✅ app.js loaded, transforming...
   - ✅ Code transformed, executing...
   - ✅ App executed successfully!

If you see ❌ (red X) instead, that's where the problem is!

---

## Still Not Working?

### Try This:
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Try a different browser** (Chrome, Firefox, Edge)
3. **Disable browser extensions** temporarily
4. **Check file permissions** - make sure files are readable
5. **Check antivirus** - might be blocking scripts

### Get Help:
1. Open browser console (F12)
2. Copy all error messages
3. Check which step failed (from the ✅ list above)
4. Share the error message for help

---

## Alternative: Use Complete System HTML

If `app.js` still doesn't work, try:
- `complete-system.html` (if it exists)
- `supermarket-full.html` (if it exists)

These might have everything embedded and work without external files.

