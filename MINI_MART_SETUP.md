# Mini Mart Setup - 2 Computers, No Internet

## ✅ YES! The System Works Perfectly for This!

Your supermarket system is **designed exactly for this scenario**:
- ✅ 2 computers (or more)
- ✅ No internet required
- ✅ Local network only (WiFi/LAN)
- ✅ Shared database
- ✅ Works offline

---

## 🏪 Setup for Mini Mart

### What You Need:

1. **Local Network (WiFi or LAN cable)**
   - Both computers on same WiFi network
   - OR connected via LAN cable to same router
   - **No internet connection needed!**

2. **One Computer as Server** (Main/Admin computer)
   - Runs the database server
   - Stores all data
   - Can also be used as POS terminal

3. **Second Computer** (Cashier/Additional terminal)
   - Connects to server computer
   - Shares same data
   - Can be used simultaneously

---

## 📋 Step-by-Step Setup

### Step 1: Setup Server Computer (Main Computer)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/ (download offline installer)
   - Install it
   - Restart computer

2. **Install Dependencies** (one time only)
   - Open Command Prompt in project folder
   - Run: `npm install`
   - Wait 2-5 minutes

3. **Start the Server**
   - Double-click: `START_SERVER.bat`
   - OR run: `npm start`
   - **Keep this window open!**

4. **Note the IP Address**
   - Look for: `Network: http://192.168.x.x:3000`
   - Example: `http://192.168.1.100:3000`
   - **Write this down!**

### Step 2: Setup Second Computer

1. **Connect to Same WiFi Network**
   - Make sure it's on the same network as server computer
   - **No internet needed** - just local network

2. **Open Web Browser**
   - Chrome, Firefox, Edge - any browser works

3. **Go to Server IP Address**
   - Type: `http://[SERVER-IP]:3000/app.html`
   - Example: `http://192.168.1.100:3000/app.html`
   - Press Enter

4. **Login**
   - Username: `admin` / Password: `admin123`
   - OR Username: `cashier` / Password: `cashier123`

5. **That's it!** ✅

---

## 💡 How It Works

```
┌─────────────────┐
│  Computer 1     │
│  (Server)       │
│  Port 3000      │◄──┐
│  Database       │   │
└─────────────────┘   │
                      │ Same WiFi/LAN
                      │ (No Internet!)
┌─────────────────┐   │
│  Computer 2     │   │
│  (Cashier)      │───┘
│  Browser        │
└─────────────────┘
```

**Both computers:**
- ✅ Share same product inventory
- ✅ Share same sales records
- ✅ Share same customer database
- ✅ Real-time updates
- ✅ Work simultaneously

---

## 🔧 Configuration

### Computer 1 (Server):
- **IP Address:** Find with `ipconfig` command
- **Server Running:** Port 3000
- **Access:** `http://localhost:3000/app.html` (on this computer)
- **Database:** `supermarket.db` file (auto-created)

### Computer 2 (Cashier):
- **Access:** `http://[COMPUTER-1-IP]:3000/app.html`
- **Example:** `http://192.168.1.100:3000/app.html`
- **No installation needed!** Just a web browser

---

## 📱 Additional Devices

You can add **more devices** too:
- ✅ Tablet for inventory management
- ✅ Phone for manager checking sales
- ✅ Third computer for another cashier
- ✅ All share same data!

**Just connect to:** `http://[SERVER-IP]:3000/app.html`

---

## 🔒 No Internet Required!

### What Works Without Internet:

✅ **All POS operations** - Make sales
✅ **Inventory management** - Add/edit products
✅ **Customer management** - Add customers, loyalty points
✅ **Sales reports** - View daily/weekly reports
✅ **Barcode scanning** - Works offline
✅ **Receipt printing** - Works offline
✅ **Multi-device sync** - All devices share data

### What Needs Internet (Optional):

❌ **Initial setup** - Download Node.js (do once, can use offline installer)
❌ **CDN libraries** - React, Tailwind (but browser caches them after first load)

**After first load, everything works offline!**

---

## 🎯 Recommended Setup

### Option A: Server + 1 Terminal
- **Computer 1:** Server + Admin dashboard
- **Computer 2:** Cashier POS terminal

### Option B: Server + 2 Terminals
- **Computer 1:** Server only (hidden in back)
- **Computer 2:** Cashier 1
- **Computer 3:** Cashier 2 (or tablet)

---

## 🛠️ Troubleshooting

### "Can't connect from Computer 2"

**Check:**
1. ✅ Both computers on same WiFi network?
2. ✅ Server running on Computer 1?
3. ✅ Using correct IP address?
4. ✅ Firewall allowing port 3000?

**Fix Firewall (Computer 1):**
```bash
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

### "Connection refused"

**Solutions:**
1. Make sure server is running on Computer 1
2. Check IP address hasn't changed (restart server to see new IP)
3. Try `http://localhost:3000/app.html` on Computer 1 first to test

### "Slow or laggy"

**Solutions:**
- Use wired connection for server computer
- Ensure good WiFi signal
- Close other apps using bandwidth

---

## 📊 Data Storage

**All data stored locally:**
- ✅ Database file: `supermarket.db` (on server computer)
- ✅ No cloud needed
- ✅ No internet needed
- ✅ Complete privacy
- ✅ Fast performance

**Backup:**
- Just copy `supermarket.db` file to USB drive
- Restore by replacing the file

---

## ✅ Perfect for Mini Mart!

Your system is **ideal** for:
- ✅ Small to medium stores
- ✅ Multiple cashiers
- ✅ No internet dependency
- ✅ Local network only
- ✅ Shared inventory
- ✅ Real-time sales tracking

**Everything works offline after initial setup!** 🎉

---

## 🚀 Quick Start Checklist

**On Server Computer:**
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server started (`npm start`)
- [ ] IP address noted

**On Second Computer:**
- [ ] Connected to same WiFi
- [ ] Browser opened
- [ ] Accessed: `http://[SERVER-IP]:3000/app.html`
- [ ] Logged in

**That's it! Both computers now share the same system!** ✅

