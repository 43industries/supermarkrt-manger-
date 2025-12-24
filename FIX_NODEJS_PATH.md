# Fix Node.js PATH Issue

## Problem: npm/node not recognized

Node.js might be installed but not in your system PATH.

---

## Quick Fix Options:

### Option 1: Restart Your Computer
After installing Node.js, **restart your computer** to update PATH.

### Option 2: Restart Terminal
Close and reopen Command Prompt/PowerShell - PATH updates when terminal starts.

### Option 3: Use Full Path
If Node.js is installed, use the full path:

**For Command Prompt:**
```cmd
"C:\Program Files\nodejs\npm.cmd" install
```

**For PowerShell:**
```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

---

## Verify Node.js Installation:

### Check if Node.js is installed:
1. Open **File Explorer**
2. Go to: `C:\Program Files\nodejs\`
3. Look for `node.exe` and `npm.cmd`

**If you see these files:** Node.js is installed, just not in PATH
**If you don't see them:** Node.js needs to be installed

---

## Install Node.js (If Not Installed):

1. **Download:** https://nodejs.org/
2. **Choose:** LTS version (recommended)
3. **Install:** Run the installer
4. **Important:** Check "Add to PATH" during installation
5. **Restart:** Your computer after installation

---

## Manual PATH Fix (Advanced):

1. **Find Node.js location:**
   - Usually: `C:\Program Files\nodejs\`

2. **Add to PATH:**
   - Right-click "This PC" → Properties
   - Advanced System Settings
   - Environment Variables
   - Edit "Path" under User variables
   - Add: `C:\Program Files\nodejs\`
   - Click OK on all windows

3. **Restart terminal** and try again

---

## Alternative: Use START_SERVER.bat

The `START_SERVER.bat` file should handle this automatically. Try:
- Double-click `START_SERVER.bat`
- It will check for Node.js and install dependencies automatically

---

## Quick Test:

After fixing PATH, test with:
```bash
node --version
npm --version
```

Both should show version numbers if working correctly.

