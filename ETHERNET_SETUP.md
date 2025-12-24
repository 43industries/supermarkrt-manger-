# 🔌 Ethernet/LAN Setup Guide - Shared Database

## 🎯 Overview

This setup allows all computers to share the same database using **Ethernet cables** and a **local network**. No internet connection needed!

**How it works:**
- One computer runs the server (main computer)
- All other computers connect to it via local network
- All data is shared in real-time
- Works completely offline (no internet needed)

---

## 📋 Requirements

1. **Ethernet cables** - Connect all computers to same router/switch
2. **Local network** - All computers on same network
3. **One computer** - Runs the server (can also be used as POS)
4. **Node.js** - Installed on the server computer

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Choose the Server Computer

Pick one computer to run the server:
- This can be any computer on your network
- It can also be used as a POS terminal
- Should be left running when others need to access data

### Step 2: Start the Server

**Option A - Easy Way:**
1. Double-click `START_LAN_SERVER.bat`
2. Server starts automatically
3. Note the IP address shown (e.g., `192.168.1.100`)

**Option B - Manual:**
1. Open terminal/command prompt
2. Navigate to project folder
3. Run: `node LAN_SERVER.js`
4. Note the IP address shown

### Step 3: Access from Other Computers

On **other computers**:
1. Open web browser
2. Go to: `http://YOUR_SERVER_IP:3000`
   - Replace `YOUR_SERVER_IP` with the IP from Step 2
   - Example: `http://192.168.1.100:3000`
3. The system opens automatically!
4. All computers now share the same data!

---

## 🔍 Finding Your Server IP Address

The server automatically shows your IP address when it starts. Look for:

```
📍 Access from OTHER computers on network:
   http://192.168.1.100:3000
```

**If you need to find it manually:**

**Windows:**
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your Ethernet adapter
4. Example: `192.168.1.100`

**Mac/Linux:**
1. Open Terminal
2. Type: `ifconfig` or `ip addr`
3. Look for your Ethernet adapter IP
4. Example: `192.168.1.100`

---

## ✅ Testing the Setup

1. **On Server Computer:**
   - Start the server
   - Open: `http://localhost:3000`
   - Add a test product

2. **On Another Computer:**
   - Open: `http://SERVER_IP:3000`
   - You should see the test product you added!

3. **Test Real-Time Sync:**
   - Computer 1: Add a sale
   - Computer 2: Refresh page
   - Sale should appear!

---

## 🔧 Network Configuration

### All Computers Must Be:

1. **On Same Network:**
   - Connected to same router/switch
   - Same subnet (e.g., all 192.168.1.x)

2. **Firewall Settings:**
   - Windows: Allow Node.js through firewall
   - Mac: System Preferences → Security → Firewall
   - Linux: Configure firewall to allow port 3000

### Windows Firewall Fix:

If other computers can't connect:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Click "Allow another app"
4. Browse to Node.js executable (usually `C:\Program Files\nodejs\node.exe`)
5. Check both "Private" and "Public"
6. Click "Add"

Or run this in Command Prompt (as Administrator):
```cmd
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

---

## 📊 How Data is Stored

- **In-Memory:** Data stored in server RAM (fast)
- **Auto-Save:** Saved to `lan_database.json` every 30 seconds
- **Backup:** File is saved in project folder
- **Persistence:** Data survives server restart

---

## 🔄 Real-Time Sync

- All computers see changes instantly
- Add product on Computer 1 → appears on Computer 2 immediately
- No refresh needed (auto-updates)

---

## 🛠️ Troubleshooting

### Other Computers Can't Connect

**Problem:** Can't access `http://SERVER_IP:3000`

**Solutions:**
1. Check server is running (look for "Server ready" message)
2. Verify IP address is correct
3. Check firewall settings (see above)
4. Make sure all computers on same network
5. Try pinging the server: `ping SERVER_IP`

### "Connection Refused" Error

**Problem:** Browser shows "connection refused"

**Solutions:**
1. Server might not be running - start it!
2. Wrong IP address - double-check
3. Firewall blocking - check firewall settings
4. Port 3000 already in use - change PORT in LAN_SERVER.js

### Data Not Syncing

**Problem:** Changes on one computer don't appear on others

**Solutions:**
1. Make sure all computers using same server IP
2. Check server is running
3. Refresh browser on other computers
4. Check browser console (F12) for errors

### Server Stops Unexpectedly

**Problem:** Server closes/errors

**Solutions:**
1. Check Node.js is installed: `node --version`
2. Check LAN_SERVER.js file exists
3. Look for error messages in console
4. Make sure port 3000 is not in use

---

## 💡 Best Practices

1. **Dedicated Server:**
   - Use one computer as dedicated server
   - Keep it running during business hours
   - Don't close the server window

2. **Backup:**
   - Regular backups of `lan_database.json`
   - Copy file to USB/external drive daily
   - Keep multiple backup copies

3. **Network:**
   - Use Ethernet cables (more reliable than WiFi)
   - Use a good quality router/switch
   - Keep network cables secure

4. **Performance:**
   - Server computer should have decent specs
   - Close unnecessary programs on server
   - Restart server daily for best performance

---

## 🆚 Comparison: LAN vs Firebase

| Feature | LAN Server | Firebase |
|---------|-----------|----------|
| Internet Required | ❌ No | ✅ Yes |
| Setup Complexity | 🟡 Medium | 🟢 Easy |
| Cost | 🟢 Free | 🟢 Free (tier) |
| Speed | 🟢 Very Fast | 🟡 Fast |
| Reliability | 🟢 High (local) | 🟢 High (cloud) |
| Backup | 🟡 Manual | 🟢 Automatic |
| Best For | Small network | Multiple locations |

---

## 📞 Support

If you need help:
1. Check browser console (F12) for errors
2. Check server console for errors
3. Verify network connectivity
4. Test with `ping` command

---

**Your LAN server is ready! All computers can now share data! 🎉**

