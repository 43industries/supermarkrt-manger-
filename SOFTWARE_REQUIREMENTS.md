# Software Requirements
## For Direct Ethernet Connection Setup

Complete list of software needed on both machines for the supermarket system.

---

## 🖥️ Machine 1 (Server) - Software Requirements

### Required Software:

#### 1. **Operating System**
- ✅ **Windows 10** or **Windows 11**
  - 32-bit or 64-bit
  - Home, Pro, or Enterprise edition
  - Already installed on your system

#### 2. **Node.js** ⭐ **REQUIRED**
- **Version**: 16.x LTS or 18.x LTS (recommended)
- **Download**: https://nodejs.org/
- **Purpose**: Runs the database server and API
- **Installation**: 
  - Download the installer from nodejs.org
  - Run installer (accept defaults)
  - Restart computer after installation
- **Verify**: Open Command Prompt, type `node --version`

#### 3. **System Files** ⭐ **REQUIRED**
- All files from this folder:
  - `server.js` - Server application
  - `database.js` - Database handling
  - `app.js` - Frontend application
  - `package.json` - Dependencies list
  - All other files in this directory
- **Purpose**: The complete supermarket system
- **Location**: Can be in any folder (e.g., `D:\supermarket system\`)

#### 4. **NPM Packages** (Installed Automatically)
- These are installed when you run `npm install`:
  - `express` - Web server framework
  - `cors` - Cross-origin resource sharing
  - `sqlite3` - Database engine
  - `react` & `react-dom` - Frontend framework (for HTML files)
- **Installation**: Automatically via `npm install` (first time setup)

---

## 💻 Machine 2 (Client) - Software Requirements

### Required Software:

#### 1. **Operating System**
- ✅ **Windows 10** or **Windows 11**
  - 32-bit or 64-bit
  - Home, Pro, or Enterprise edition
  - Already installed on your system

#### 2. **Web Browser** ⭐ **REQUIRED**
- Choose one (all work fine):
  - **Google Chrome** (recommended)
  - **Microsoft Edge** (recommended)
  - **Mozilla Firefox**
  - **Opera**
- **Download**:
  - Chrome: https://www.google.com/chrome/
  - Edge: Usually pre-installed on Windows 10/11
  - Firefox: https://www.mozilla.org/firefox/
- **Purpose**: Access the supermarket system
- **Note**: No other software needed! Browser is sufficient.

---

## 📦 Optional Software (Not Required)

### Machine 1 (Server) - Optional:
- ❌ **Text Editor** (optional) - For viewing code
  - Notepad++ (https://notepad-plus-plus.org/)
  - VS Code (https://code.visualstudio.com/)
  - Or just use Windows Notepad
- ❌ **Git** (optional) - For version control (not needed)

### Machine 2 (Client) - Optional:
- ❌ **No optional software needed** - Just a browser!

---

## 🔧 Software Installation Checklist

### Machine 1 (Server):

- [ ] **Windows 10/11** - Already installed ✅
- [ ] **Node.js** - Download and install from nodejs.org
  - [ ] Verify installation: `node --version` in Command Prompt
- [ ] **System Files** - Copy all files to a folder
- [ ] **NPM Packages** - Run `npm install` in system folder
  - [ ] Wait for installation to complete (2-5 minutes)
  - [ ] Verify: `node_modules` folder created

### Machine 2 (Client):

- [ ] **Windows 10/11** - Already installed ✅
- [ ] **Web Browser** - Install Chrome, Edge, or Firefox
  - [ ] Verify: Browser opens and can access websites
- [ ] **That's it!** No other software needed ✅

---

## 📥 Download Links

### Machine 1 (Server):

**Node.js:**
- Official Site: https://nodejs.org/
- Direct Download (LTS 18.x): https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi
- Direct Download (LTS 16.x): https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi
- **Note**: Choose the LTS (Long Term Support) version

**System Files:**
- Already in this folder - no download needed

### Machine 2 (Client):

**Browsers:**
- **Chrome**: https://www.google.com/chrome/
- **Edge**: Pre-installed on Windows 10/11
- **Firefox**: https://www.mozilla.org/firefox/

---

## 🚀 First-Time Setup Process

### Machine 1 (Server) - Initial Setup:

1. **Install Node.js**
   ```bash
   # Download from nodejs.org
   # Run installer
   # Restart computer
   # Verify: node --version
   ```

2. **Navigate to System Folder**
   ```bash
   cd "D:\supermarket system"
   # (or wherever your files are)
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # Wait 2-5 minutes
   # Creates node_modules folder
   ```

4. **Verify Installation**
   ```bash
   node server.js
   # Should start server
   # Press Ctrl+C to stop
   ```

5. **Configure Network** (for direct Ethernet)
   - Run `SETUP_DIRECT_ETHERNET.bat` as Administrator
   - OR configure IP manually: 192.168.1.100

### Machine 2 (Client) - Initial Setup:

1. **Install Browser** (if not already installed)
   - Download Chrome/Edge/Firefox
   - Install (follow installer prompts)

2. **Configure Network** (for direct Ethernet)
   - Set static IP: 192.168.1.101
   - Subnet: 255.255.255.0

3. **Connect**
   - Open browser
   - Go to: `http://192.168.1.100:3000/app.html`

**That's it!** No other setup needed.

---

## 💾 Disk Space Requirements

### Machine 1 (Server):
- **Node.js**: ~200 MB
- **System Files**: ~50 MB
- **NPM Packages** (node_modules): ~150 MB
- **Database** (supermarket.db): Grows with data (starts ~1 MB)
- **Total**: ~400 MB initially

### Machine 2 (Client):
- **Browser**: ~200-500 MB (depending on browser)
- **Total**: ~200-500 MB

---

## ⚙️ System Requirements

### Machine 1 (Server):
- **CPU**: Intel Core 2 Duo or better (your i5-2400 is perfect ✅)
- **RAM**: 4GB minimum (you have 4GB ✅)
- **Storage**: 500 MB free space
- **Network**: Ethernet port

### Machine 2 (Client):
- **CPU**: Any modern CPU (most computers work)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500 MB free space
- **Network**: Ethernet port

---

## 🔍 Verification Commands

### Machine 1 (Server):

**Check Node.js:**
```bash
node --version
# Should show: v16.x.x or v18.x.x
```

**Check NPM:**
```bash
npm --version
# Should show: 8.x.x or 9.x.x
```

**Check Dependencies:**
```bash
npm list --depth=0
# Should show: express, cors, sqlite3, etc.
```

**Check System Files:**
```bash
dir
# Should show: server.js, database.js, app.js, package.json, etc.
```

### Machine 2 (Client):

**Check Browser:**
- Open browser
- Type: `chrome://version` (Chrome) or `about:version` (Firefox)
- Should show browser version

**Check Network:**
```bash
ipconfig
# Should show IP: 192.168.1.101 (if configured)
```

---

## 🆘 Troubleshooting Software Issues

### Problem: "Node.js not found"

**Solution:**
- Node.js not installed or not in PATH
- Download and install from nodejs.org
- Restart computer after installation
- Verify: `node --version` in new Command Prompt window

### Problem: "npm install fails"

**Possible causes:**
- No internet connection (needed for first install only)
- Antivirus blocking
- Insufficient disk space

**Solutions:**
- Check internet connection
- Temporarily disable antivirus
- Free up disk space
- Run Command Prompt as Administrator

### Problem: "Module not found" errors

**Solution:**
- Dependencies not installed
- Run: `npm install` in system folder
- Wait for completion
- Verify `node_modules` folder exists

### Problem: Browser can't connect

**Check:**
- Server running on Machine 1?
- Correct URL? (`http://192.168.1.100:3000/app.html`)
- Network configured correctly?
- Firewall allows connection?

---

## 📋 Quick Summary

### Machine 1 (Server) Needs:
1. ✅ Windows 10/11 (already have)
2. ✅ Node.js (download and install)
3. ✅ System files (already have)
4. ✅ Run `npm install` once (installs dependencies)

### Machine 2 (Client) Needs:
1. ✅ Windows 10/11 (already have)
2. ✅ Web browser (Chrome/Edge/Firefox)
3. ✅ That's it!

**Total New Software Needed:**
- **Machine 1**: Just Node.js
- **Machine 2**: Just a browser (probably already have)

---

## 🎯 Recommended Setup

### Machine 1 (Server):
- **OS**: Windows 10/11
- **Node.js**: 18.x LTS
- **Browser**: Edge (for testing)
- **Text Editor**: Notepad++ (optional, for viewing code)

### Machine 2 (Client):
- **OS**: Windows 10/11
- **Browser**: Chrome or Edge (recommended)

---

**That's all the software you need!** Simple and minimal! 🚀

