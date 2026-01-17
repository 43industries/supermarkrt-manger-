# 📁 Check libs/ Folder on Old Machine

## ❌ The Error

```
Failed to load resource: net::ERR_FILE_NOT_FOUND
- react.min.js
- react-dom.min.js
- babel.min.js
```

**This means:** The `libs/` folder is missing or in the wrong location!

---

## ✅ Solution: Copy libs/ Folder

### On This Machine (Where It Works):

1. **Find the `libs/` folder:**
   - Location: `D:\surematress\libs\`
   - Should contain: `react.min.js`, `react-dom.min.js`, `babel.min.js`, etc.

2. **Copy the entire `libs/` folder** to the old machine

### On Old Machine:

1. **Paste `libs/` folder** in the same directory as `complete-system-offline.html`
2. **Make sure structure is:**
   ```
   [Old Machine Folder]/
   ├── complete-system-offline.html
   └── libs/
       ├── react.min.js
       ├── react-dom.min.js
       ├── babel.min.js
       ├── tailwind.js (optional)
       └── qrcode.min.js (optional)
   ```

---

## 🔍 Verify libs/ Folder

**On old machine, check:**

1. **Open the folder** where `complete-system-offline.html` is
2. **Do you see `libs/` folder?** ✅ or ❌
3. **Open `libs/` folder**
4. **Do you see these files?**
   - ✅ `react.min.js`
   - ✅ `react-dom.min.js`
   - ✅ `babel.min.js`

**If any are missing:**
- Copy the entire `libs/` folder from this machine
- Make sure it's in the same directory

---

## 🚀 After Copying libs/ Folder

1. **Refresh the browser** (F5)
2. **Check console** (F12)
3. **Should see:**
   - ✅ "React loaded from local file"
   - ✅ "ReactDOM loaded from local file"
   - ✅ "Babel loaded from local file"
   - ✅ "All core libraries loaded successfully"

---

## 📋 Quick Checklist

- [ ] `libs/` folder exists on old machine
- [ ] `libs/` folder is in same directory as HTML file
- [ ] `libs/react.min.js` exists
- [ ] `libs/react-dom.min.js` exists
- [ ] `libs/babel.min.js` exists

**If all checked:** The app should work! ✅

---

## 🆘 If libs/ Folder Doesn't Exist

**Option 1: Copy from this machine**
- Copy entire `libs/` folder
- Paste to old machine in same directory as HTML file

**Option 2: Use web server** (libs folder not needed if server serves it)
- Run: `node server.js`
- Open: `http://localhost:3000/complete-system-offline.html`
- Server will serve libs/ folder automatically

---

**The fix is applied - just make sure `libs/` folder exists on the old machine!** 📁
