# Two-Machine Setup Guide
## For Older Hardware (Intel i5-2400, 4GB RAM)

This guide shows you how to set up the supermarket system to work on **two computers** with the same older hardware specifications.

---

## 🖥️ Setup Overview

### Machine 1: Server (Main Computer)
- **Role**: Runs the database server
- **Requirements**: 
  - Node.js installed
  - System files and database
  - Connected to network/WiFi
  - **Recommended**: Use this machine for admin tasks

### Machine 2: Client (Second Computer)
- **Role**: Access the system via web browser
- **Requirements**:
  - Web browser only (Chrome, Edge, Firefox)
  - Connected to **same WiFi network** as Machine 1
  - **No software installation needed!**

---

## 📋 What You Need

### For Machine 1 (Server):
✅ **Node.js** - Download from https://nodejs.org/ (use LTS version 16.x or 18.x)
✅ **System Files** - All files from this folder
✅ **Network Connection** - WiFi or Ethernet
✅ **4GB RAM** - Already optimized for this

### For Machine 2 (Client):
✅ **Web Browser** - Chrome, Edge, or Firefox
✅ **Network Connection** - Same WiFi network as Machine 1
✅ **That's it!** No other software needed

---

## 🚀 Step-by-Step Setup

### Step 1: Prepare Machine 1 (Server)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Choose **LTS version** (16.x or 18.x recommended)
   - Run installer and follow instructions
   - Restart computer after installation

2. **Copy System Files**
   - Make sure all files are in one folder
   - Example: `D:\supermarket system\`

3. **Install Dependencies** (First time only)
   - Open Command Prompt in the system folder
   - Run: `npm install`
   - Wait for installation to complete (2-5 minutes)

4. **Configure Firewall** (One-time setup)
   - Open Command Prompt as Administrator
   - Run this command:
   ```bash
   netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
   ```
   - This allows other computers to connect

### Step 2: Start Server on Machine 1

1. **Double-click**: `START_OPTIMIZED.bat`
   - OR use: `START_SERVER.bat`

2. **Wait for server to start** (3-5 seconds)

3. **Note the IP Address** shown in the console:
   ```
   🌐 Network Access:
      Local:    http://localhost:3000
      Network:  http://192.168.1.100:3000  ← Write this down!
   ```

4. **Keep the server window open** - Don't close it!

### Step 3: Connect Machine 2 (Client)

1. **Make sure Machine 2 is on the same WiFi network** as Machine 1

2. **Open a web browser** (Chrome, Edge, or Firefox)

3. **Type the IP address** from Step 2:
   ```
   http://192.168.1.100:3000/app.html
   ```
   (Replace `192.168.1.100` with your actual IP address)

4. **Press Enter** - The login page should appear

5. **Login** with:
   - Username: `admin` / Password: `admin123`
   - OR Username: `cashier` / Password: `cashier123`

6. **That's it!** Machine 2 is now connected

---

## 🔍 Finding Your IP Address

If you need to find the IP address again:

### On Machine 1 (Server):
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for **IPv4 Address** under your WiFi adapter
   - Example: `192.168.1.100`

### Or Check Server Console:
The server automatically displays the IP when it starts!

---

## ✅ Verification Checklist

### Machine 1 (Server):
- [ ] Node.js installed and working
- [ ] Dependencies installed (`npm install` completed)
- [ ] Firewall rule added (port 3000 allowed)
- [ ] Server started successfully
- [ ] IP address noted
- [ ] Server window still open

### Machine 2 (Client):
- [ ] Connected to same WiFi network
- [ ] Web browser installed
- [ ] Can access: `http://[IP-ADDRESS]:3000/app.html`
- [ ] Login page appears
- [ ] Can login successfully

---

## 🎯 Usage Scenarios

### Scenario 1: Store + Office
- **Machine 1 (Store)**: Server + POS terminal for cashier
- **Machine 2 (Office)**: Admin dashboard for manager
- Both share the same inventory and sales data

### Scenario 2: Two Cash Registers
- **Machine 1**: Server + Cash Register 1
- **Machine 2**: Cash Register 2 (via browser)
- Both can process sales simultaneously

### Scenario 3: Main + Backup
- **Machine 1**: Main server (always running)
- **Machine 2**: Backup/alternate access point
- Can switch between machines if needed

---

## ⚡ Performance Tips for 4GB RAM Systems

### On Machine 1 (Server):
1. **Close unnecessary applications** before starting server
2. **Use wired connection** if possible (more stable)
3. **Limit to 2-3 simultaneous users** for best performance
4. **Restart server daily** to clear memory

### On Machine 2 (Client):
1. **Close other browser tabs** while using the system
2. **Use Chrome or Edge** for best performance
3. **Refresh page** if it becomes slow

### Network:
1. **Use same WiFi network** for both machines
2. **Ensure good WiFi signal** strength
3. **Avoid public/unreliable networks**

---

## 🐛 Troubleshooting

### Problem: Machine 2 can't connect

**Check:**
1. ✅ Server running on Machine 1?
2. ✅ Both machines on same WiFi network?
3. ✅ Using correct IP address?
4. ✅ Firewall allows port 3000?

**Solutions:**
- Verify IP address: Check server console or run `ipconfig` on Machine 1
- Test connection: Try `http://localhost:3000/app.html` on Machine 1 first
- Check firewall: Run firewall command again (see Step 1)
- Restart server: Close and restart `START_OPTIMIZED.bat`

### Problem: "Connection refused" or "Can't reach this page"

**Possible causes:**
- Server not running
- Wrong IP address
- Different WiFi networks
- Firewall blocking

**Fix:**
1. Make sure server is running on Machine 1
2. Verify both machines show same WiFi network name
3. Try pinging: On Machine 2, open Command Prompt and type:
   ```
   ping [MACHINE1-IP-ADDRESS]
   ```
   Example: `ping 192.168.1.100`
   - If ping works, network is fine
   - If ping fails, check WiFi connection

### Problem: Slow or laggy performance

**Solutions:**
- Close other applications on both machines
- Use wired connection for Machine 1 (server)
- Restart both machines
- Check Task Manager for memory usage
- Limit to 2 users maximum on 4GB RAM systems

### Problem: IP address changed

**Solution:**
- IP addresses can change when WiFi reconnects
- Restart server to see new IP address
- Update Machine 2 with new IP address
- Or set static IP on Machine 1 (advanced)

---

## 🔒 Security Notes

### For Local Network (Home/Office):
- ✅ Safe to use - only devices on your WiFi can access
- ✅ No internet required
- ✅ Data stays on your local network
- ✅ No external access possible

### Important:
- ⚠️ Change default passwords for production use
- ⚠️ Only use on trusted networks
- ⚠️ Don't expose to public internet without security

---

## 📊 How It Works

```
┌─────────────────┐
│   Machine 1     │
│   (Server)      │
│                 │
│  - Node.js      │──┐
│  - Database     │  │
│  - Port 3000    │  │
└─────────────────┘  │
                     │
                  WiFi Network
                     │
┌─────────────────┐  │
│   Machine 2     │──┘
│   (Client)      │
│                 │
│  - Browser      │
│  - No install   │
└─────────────────┘
```

**Both machines share:**
- ✅ Same product inventory
- ✅ Same sales records
- ✅ Same customer database
- ✅ Real-time updates

---

## 💾 Data Storage

**All data is stored on Machine 1:**
- Database file: `supermarket.db`
- Location: Same folder as server files
- **Backup**: Copy `supermarket.db` to USB drive regularly

**Machine 2:**
- No data stored locally
- All data comes from Machine 1
- Can be used on any computer with browser

---

## 🎉 You're Ready!

Once both machines are connected:

1. **Machine 1**: Keep server running
2. **Machine 2**: Access via browser anytime
3. **Both machines**: Share the same data in real-time
4. **Changes on one**: Appear immediately on the other

**Everything works offline - no internet needed!** 🚀

---

## 📞 Quick Reference

### Start Server (Machine 1):
```
START_OPTIMIZED.bat
```

### Access from Machine 2:
```
http://[MACHINE1-IP]:3000/app.html
```

### Login:
- Admin: `admin` / `admin123`
- Cashier: `cashier` / `cashier123`

### Find IP Address:
```
ipconfig
```

### Allow Firewall:
```
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

---

**Need help?** Check `MULTI_DEVICE_SETUP.md` for more details.

