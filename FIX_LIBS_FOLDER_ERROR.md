# 🔧 Fix: libs/ Folder Not Found Errors

## ❌ The Problem

**Errors you see:**
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
- react.min.js
- react-dom.min.js
- babel.min.js
- tailwind.js
- qrcode.min.js
```

**Cause:** Scripts are trying to load from `/libs/` (absolute path) which doesn't work with `file://` protocol.

---

## ✅ The Fix

**Updated to use relative paths** (`./libs/`) when using `file://` protocol.

**What changed:**
- ✅ Detects `file://` protocol
- ✅ Uses `./libs/` instead of `/libs/`
- ✅ Falls back to CDN if local files not found
- ✅ Better error messages

---

## 📋 What You Need

### On the Old Machine:

1. **Make sure `libs/` folder exists:**
   - Should be in same directory as `complete-system-offline.html`
   - Path: `D:/surematress/libs/`

2. **Check `libs/` folder has these files:**
   - ✅ `react.min.js`
   - ✅ `react-dom.min.js`
   - ✅ `babel.min.js`
   - ⚠️ `tailwind.js` (optional)
   - ⚠️ `qrcode.min.js` (optional)

3. **File structure should be:**
   ```
   D:/surematress/
   ├── complete-system-offline.html
   └── libs/
       ├── react.min.js
       ├── react-dom.min.js
       ├── babel.min.js
       ├── tailwind.js (optional)
       └── qrcode.min.js (optional)
   ```

---

## 🔍 Check if libs/ Folder Exists

**On the old machine:**

1. **Open the folder** where `complete-system-offline.html` is located
2. **Look for `libs/` folder**
3. **Open `libs/` folder**
4. **Check if files are there**

**If `libs/` folder doesn't exist:**
- Copy the entire `libs/` folder from this machine
- Make sure it's in the same directory as the HTML file

---

## 🚀 After Fix Applied

**The updated file will:**
- ✅ Use `./libs/react.min.js` (relative path) for file://
- ✅ Use `/libs/react.min.js` (absolute path) for http://
- ✅ Fall back to CDN if local files not found
- ✅ Show clear error if files truly missing

---

## 📋 Quick Checklist

**Before opening the file:**

- [ ] `complete-system-offline.html` exists
- [ ] `libs/` folder exists in same directory
- [ ] `libs/react.min.js` exists
- [ ] `libs/react-dom.min.js` exists
- [ ] `libs/babel.min.js` exists

**If any are missing:**
- Copy the `libs/` folder from this machine
- Make sure it's in the same directory

---

## 🆘 If Still Getting Errors

**Check browser console (F12):**

1. **If still "ERR_FILE_NOT_FOUND":**
   - `libs/` folder is missing or in wrong location
   - Copy `libs/` folder to same directory as HTML file

2. **If "React is not defined":**
   - Files didn't load
   - Check `libs/` folder exists
   - Try using web server instead

3. **If "All core libraries loaded successfully":**
   - ✅ Libraries loaded!
   - App should work (even if page looks blank, check if login form is there)

---

## ✅ Best Solution

**Use a web server** (fixes all path issues):

```bash
node server.js
```

Then open:
```
http://localhost:3000/complete-system-offline.html
```

**All errors will be gone!** ✅

---

**The fix is applied. Make sure `libs/` folder exists in the same directory as the HTML file!** 📁
