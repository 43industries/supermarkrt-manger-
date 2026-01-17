# 🔧 Fix Railway Deployment - Step by Step

## What I Fixed

1. **Increased health check timeout** (100ms → 300ms)
   - Railway was checking health too quickly
   - Server might need time to start

2. **Created troubleshooting guide** (`RAILWAY_TROUBLESHOOTING.md`)

---

## 🔍 Check What Went Wrong

### Step 1: View Railway Logs

**In Railway Dashboard:**
1. Go to your project
2. Click **"Deployments"** tab (top)
3. Click on the **failed deployment** (red X)
4. Click **"View Logs"** or **"Logs"** tab
5. Scroll to find **red error messages**

**What to look for:**
- ❌ Red errors (usually at the bottom)
- ⚠️ Yellow warnings
- Specific error messages

---

## 🛠️ Common Issues & Quick Fixes

### Issue 1: Health Check Timeout
**Error:** "Health check failed" or "Timeout"

**Fixed:** ✅ Increased timeout in `railway.json` to 300ms

**Action:**
1. Commit and push the fix (already done)
2. Go to Railway → Deployments → Click **"..."** → **"Redeploy"**

---

### Issue 2: Build Failed
**Error:** "npm install failed" or "Build failed"

**Possible causes:**
- Missing dependencies
- Node version issue
- Build timeout

**Solutions:**

**A. Check Node Version:**
1. Railway Dashboard → Settings → Variables
2. Add variable: `NODE_VERSION=18`
3. Redeploy

**B. Check Dependencies:**
- Verify `package.json` has all dependencies ✅
- All dependencies are listed ✅

**C. Check Build Logs:**
- Look for specific npm error
- Check if it's a dependency issue

---

### Issue 3: Start Command Failed
**Error:** "Start command failed" or "Port not accessible"

**Check:**
1. Railway Dashboard → Settings → Deploy
2. **Start Command** should be: `node server.js`
   OR
   - Leave empty (uses `npm start` from package.json)

**Verify:**
- Your `package.json` has: `"start": "node server.js"` ✅
- Your `server.js` uses: `process.env.PORT || 3000` ✅

---

### Issue 4: Database Error
**Error:** Database connection or initialization error

**Solutions:**
1. **SQLite works on Railway** ✅
2. **Database file is created automatically** ✅
3. **Check logs** for specific database error

**Common fixes:**
- Database path is correct ✅ (uses `__dirname`)
- Tables are created automatically ✅
- Check logs for specific error

---

### Issue 5: Module Not Found
**Error:** "Cannot find module 'xxx'"

**Solutions:**
1. **Check package.json** has all dependencies ✅
2. **Make sure node_modules is ignored** (it should be)
3. **Redeploy** - Railway will reinstall dependencies

---

## 🚀 Try Redeploying

After checking logs and identifying the issue:

### Option 1: Redeploy from GitHub
1. The fixes are pushed to GitHub
2. Railway will auto-redeploy (if auto-deploy is enabled)
3. OR: Railway → Deployments → ... → Redeploy

### Option 2: Manual Redeploy
1. Railway Dashboard → Deployments
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment (1-2 minutes)

---

## 📋 Deployment Checklist

Before redeploying, verify:

- [x] `railway.json` has health check timeout ≥ 300ms ✅
- [x] `package.json` has all dependencies ✅
- [x] `server.js` uses `process.env.PORT || 3000` ✅
- [x] `/api/health` endpoint exists ✅
- [x] Database path is correct ✅
- [x] Code pushed to GitHub ✅

---

## 🔍 Check Logs - Step by Step

**To diagnose the issue:**

1. **Open Railway Dashboard**
2. **Click your project**
3. **Click "Deployments" tab**
4. **Click on the failed deployment** (red X icon)
5. **Click "View Logs" or "Logs" tab**
6. **Scroll down** to see errors
7. **Look for red text** - that's the error!

**Share the error message** from logs so we can fix it specifically!

---

## ⚙️ Railway Settings to Check

**In Railway Dashboard → Settings → Deploy:**

- **Start Command:** `node server.js` (or leave empty)
- **Health Check Path:** `/api/health`
- **Health Check Timeout:** `300` (or higher)
- **Restart Policy:** `ON_FAILURE` (default)

**In Railway Dashboard → Settings → Variables:**

- Add `NODE_VERSION=18` if build fails
- Add M-Pesa variables if needed

---

## 🆘 Share the Error

**After checking logs, share:**
1. **Error message** (red text from logs)
2. **Which step failed** (Build / Start / Health Check)
3. **Any warnings** before the error

**I can then provide a specific fix!**

---

## ✅ After Fixes Applied

The updated `railway.json` should help with:
- ✅ Longer health check timeout
- ✅ Proper build command
- ✅ Correct start command

**Try redeploying now:**
1. Railway → Deployments
2. Click **"..."** → **"Redeploy"**
3. Watch the logs
4. See if it succeeds!

---

**Check the logs first, then share the error message!** 🔍

