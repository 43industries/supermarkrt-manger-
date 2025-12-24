# Quick Start Guide

## ✅ System is Now Fixed!

The system now works **WITH or WITHOUT** Node.js!

## 🚀 How to Use (Choose One Method)

### Method 1: Without Node.js (Easiest - Works Immediately)

1. **Simply open** `standalone.html` or `app.html` in your web browser
   - Double-click the file, or
   - Right-click → Open with → Your browser

2. **Login with:**
   - Username: `admin` / Password: `admin123`
   - OR Username: `cashier` / Password: `cashier123`

3. **That's it!** The system will work using localStorage (browser storage)

**Note:** Data is saved in your browser. If you clear browser data, it will reset.

---

### Method 2: With Node.js (Recommended - Database Features)

1. **Install Node.js** (if not installed):
   - Download from: https://nodejs.org/
   - Install the LTS version
   - Restart your computer after installation

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   - Double-click `START_SERVER.bat`
   - OR run: `npm start`

4. **Open browser:**
   - Go to: `http://localhost:3000/app.html`

5. **Login** with the same credentials

**Benefits of Method 2:**
- ✅ Data stored in database (survives browser clears)
- ✅ Multiple devices can access same data
- ✅ Better performance
- ✅ Can backup database file

---

## 🔧 Troubleshooting

### "System isn't loading"
- **If using Method 1:** Make sure you have internet (for CDN libraries)
- **If using Method 2:** Make sure Node.js is installed and server is running

### "Node.js not found"
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### "Port 3000 already in use"
- Close other applications using port 3000
- OR change port in `server.js` (line 7): `const PORT = 3001;`

### "Data not saving"
- **Method 1:** Check browser settings - make sure localStorage is enabled
- **Method 2:** Check if server is running and check browser console (F12)

---

## 📝 What Changed?

The system now has **automatic fallback**:
- ✅ Tries to connect to database server first
- ✅ If server unavailable, uses localStorage automatically
- ✅ Works immediately without any setup
- ✅ Seamlessly switches to database when server is available

---

## 🎯 Next Steps

1. **Try Method 1 first** - Just open `standalone.html` in your browser
2. **If you want database features**, install Node.js and use Method 2
3. **Enjoy your supermarket system!**

---

**Need Help?** Check the browser console (F12) for any error messages.

