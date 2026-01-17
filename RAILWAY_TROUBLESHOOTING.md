# 🆘 Railway Deployment Troubleshooting

## Common Issues and Solutions

### Issue 1: Health Check Failed
**Symptom:** Deployment fails with "Health check failed"

**Solution:**
1. Check Railway logs for specific error
2. Make sure `/api/health` endpoint is accessible
3. Health check timeout might be too short (updated to 300ms)

**Check logs:**
- Railway Dashboard → Your Project → Deployments → Click latest → View Logs

---

### Issue 2: Build Failed
**Symptom:** "Build failed" or "npm install failed"

**Solutions:**
1. **Check Node.js version:**
   - Railway auto-detects, but you can specify:
   - In Railway dashboard → Settings → Add variable:
     - `NODE_VERSION=18` (or `20`)

2. **Missing dependencies:**
   - Check `package.json` has all required packages
   - All dependencies are listed ✅

3. **Build timeout:**
   - If build takes too long, check logs
   - SQLite3 might need extra time to compile

---

### Issue 3: Server Won't Start
**Symptom:** "Start command failed" or "Port not accessible"

**Solutions:**

1. **Port configuration:**
   - Railway sets `PORT` automatically ✅
   - Your `server.js` uses: `process.env.PORT || 3000` ✅
   - This should work!

2. **Database initialization:**
   - Check logs for database errors
   - Database file is created automatically ✅

3. **Check start command:**
   - Railway should use: `node server.js`
   - Or: `npm start` (which runs `node server.js`)
   - Verify in Railway → Settings → Deploy → Start Command

---

### Issue 4: "Cannot find module"
**Symptom:** Module not found errors

**Solutions:**
1. **Check dependencies in package.json:**
   ```json
   {
     "dependencies": {
       "express": "^4.18.2",
       "axios": "^1.6.2",
       "cors": "^2.8.5",
       "dotenv": "^16.3.1",
       "serverless-http": "^3.2.0",
       "sqlite3": "^5.1.6"
     }
   }
   ```

2. **Make sure node_modules is NOT in .gitignore:**
   - ✅ It should be ignored (Railway installs fresh)

3. **Rebuild:**
   - In Railway → Deployments → ... → Redeploy

---

### Issue 5: Database Errors
**Symptom:** Database connection errors

**Solutions:**
1. **SQLite works on Railway:**
   - ✅ SQLite is file-based, works perfectly
   - ✅ Database file is persistent between deployments

2. **Check database path:**
   - Your `database.js` uses: `path.join(__dirname, 'supermarket.db')` ✅
   - This creates database in project root ✅

3. **Check logs for specific error:**
   - Look for database initialization errors
   - Check if tables are created

---

### Issue 6: Timeout Errors
**Symptom:** Request timeout or health check timeout

**Solutions:**
1. **Increase health check timeout:**
   - ✅ Updated in `railway.json` to 300ms
   - Railway dashboard → Settings → Health Check → Increase timeout

2. **Check server startup time:**
   - Database initialization might take time
   - Check logs for startup duration

---

## 🔍 How to Check Logs

### In Railway Dashboard:
1. Go to your project
2. Click **"Deployments"** tab
3. Click on the latest deployment (failed one)
4. Click **"View Logs"** or **"Logs"** tab
5. Look for errors in red

### What to Look For:
- ❌ Red errors
- ⚠️ Yellow warnings
- ✅ Success messages

### Common Log Errors:
```
Error: Cannot find module 'express'
→ Dependencies not installed

Error: EADDRINUSE: address already in use
→ Port conflict (Railway handles this)

Error: ENOENT: no such file or directory
→ Missing file or wrong path

Error: timeout
→ Health check timeout (increase timeout)
```

---

## 🛠️ Quick Fixes

### Fix 1: Update Railway Config
The `railway.json` has been updated with:
- Health check timeout: 300ms (was 100ms)
- Proper start command

### Fix 2: Check Deployment Settings
In Railway dashboard:
1. Go to your project → **Settings** → **Deploy**
2. Check:
   - **Start Command:** Should be `node server.js` or `npm start`
   - **Health Check Path:** Should be `/api/health`
   - **Health Check Timeout:** Should be at least 300ms

### Fix 3: Redeploy
1. In Railway dashboard → **Deployments**
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

### Fix 4: Check Environment Variables
If you need environment variables:
1. Railway Dashboard → **Variables** tab
2. Add any needed variables (like M-Pesa keys)
3. Redeploy after adding

---

## 📋 Deployment Checklist

Before deploying, verify:
- [x] `package.json` has all dependencies
- [x] `server.js` uses `process.env.PORT || 3000`
- [x] `/api/health` endpoint exists
- [x] `railway.json` is correct
- [x] Database file will be created automatically
- [x] No hardcoded paths

---

## 🆘 Still Having Issues?

1. **Check Railway logs** (most important!)
2. **Share error message** from logs
3. **Check deployment settings** in Railway dashboard
4. **Try redeploying** after fixes

---

## 📞 Get Help

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app

---

## ✅ What Should Work

After fixing issues, your deployment should:
- ✅ Build successfully (npm install completes)
- ✅ Start server (node server.js runs)
- ✅ Pass health check (/api/health returns 200)
- ✅ Database initializes (creates tables)
- ✅ Server responds to requests

**Check logs to see which step is failing!**

