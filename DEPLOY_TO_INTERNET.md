# 🌐 Deploy Your POS System to the Internet

This guide will help you deploy your 43_Industries POS System to the internet using **Railway** (free tier available).

---

## 🚀 Quick Start (Railway)

### Step 1: Push Code to GitHub

1. **Make sure all changes are committed:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify your code is on GitHub:**
   - Go to: https://github.com/43industries/supermarkrt-manger-
   - Make sure `server.js`, `package.json`, `railway.json`, and `nixpacks.toml` are there

---

### Step 2: Deploy on Railway

1. **Sign up/Login to Railway:**
   - Go to: https://railway.app
   - Click **"Login"** → **"Login with GitHub"**
   - Authorize Railway to access your GitHub

2. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository: `supermarkrt-manger-`
   - Railway will automatically detect your project

3. **Railway will automatically:**
   - ✅ Detect Node.js project
   - ✅ Read `railway.json` and `nixpacks.toml`
   - ✅ Install dependencies (`npm install --no-package-lock`)
   - ✅ Start server (`node server.js`)
   - ✅ Check health at `/api/health`

4. **Wait for deployment** (2-5 minutes):
   - Watch the **"Deployments"** tab
   - Check **"Logs"** if there are errors

---

### Step 3: Get Your Domain

1. **After deployment succeeds:**
   - Go to your project → **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Railway will give you a domain like: `your-app.up.railway.app`

2. **Your app is now live!**
   - Open: `https://your-app.up.railway.app`
   - The main system will be at: `https://your-app.up.railway.app/complete-system.html`
   - Or just: `https://your-app.up.railway.app` (server.js serves complete-system.html at root)

---

## 🔧 Configure Environment Variables (Optional)

If you need M-Pesa integration or other API keys:

1. **In Railway Dashboard:**
   - Go to your project → **Variables** tab
   - Click **"New Variable"**
   - Add your variables:

   ```
   MPESA_CONSUMER_KEY=your_key_here
   MPESA_CONSUMER_SECRET=your_secret_here
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   MPESA_CALLBACK_URL=https://your-app.up.railway.app/api/mpesa/callback
   MPESA_ENVIRONMENT=sandbox
   PORT=3000
   ```

2. **Redeploy after adding variables:**
   - Railway will automatically redeploy when you add variables

---

## ✅ Verify Deployment

1. **Check Health Endpoint:**
   - Visit: `https://your-app.up.railway.app/api/health`
   - Should return: `{"status":"ok","service":"43_Industries POS",...}`

2. **Test Main App:**
   - Visit: `https://your-app.up.railway.app`
   - Should load the POS system interface

3. **Check Logs:**
   - Railway Dashboard → **Deployments** → Click latest → **"View Logs"**
   - Look for: `Server running on port 3000` or similar

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Error:** `npm ci` or `npm install` fails

**Fix:**
- Check Railway logs for specific error
- Make sure `package.json` is valid
- Railway uses `npm install --no-package-lock` (configured in `nixpacks.toml`)

---

### Issue: Health Check Fails

**Error:** Deployment succeeds but health check times out

**Fix:**
1. Check if `/api/health` endpoint exists in `server.js` ✅ (it does)
2. Increase `healthcheckTimeout` in `railway.json` (currently 500ms)
3. Check server logs to see if server is starting

---

### Issue: Blank Page After Deployment

**Error:** App loads but shows blank page

**Fix:**
1. Open browser console (F12)
2. Check for errors loading scripts
3. Make sure `libs/` folder is in your GitHub repo
4. Check that `complete-system.html` is being served correctly

---

### Issue: Database Errors

**Error:** SQLite database issues

**Fix:**
- Railway creates a fresh database on each deployment
- Database file is in `.gitignore` (correct)
- Server will auto-create tables on first run

---

## 🔄 Update Your Deployment

Whenever you make changes:

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Railway auto-deploys:**
   - Railway watches your GitHub repo
   - New commits trigger automatic redeployment
   - Check **"Deployments"** tab to see progress

---

## 📊 Monitor Your App

1. **View Logs:**
   - Railway Dashboard → **Deployments** → Latest → **"View Logs"**
   - See real-time server output

2. **Check Metrics:**
   - Railway Dashboard → **Metrics**
   - See CPU, Memory, Network usage

3. **Set Up Alerts:**
   - Railway Dashboard → **Settings** → **Notifications**
   - Get emails when deployment fails

---

## 💰 Railway Pricing

- **Free Tier:** $5 credit/month (enough for small apps)
- **Hobby Plan:** $5/month (if you exceed free tier)
- **Pro Plan:** $20/month (for production apps)

**Your app should work on the free tier!**

---

## 🌍 Alternative: Deploy to Other Platforms

### Vercel (Frontend-focused)
- Good for static sites
- Free tier available
- See `VERCEL_FIX_EXPLANATION.md` for details

### Render
- Similar to Railway
- Free tier available
- Good for Node.js apps

### Heroku
- Paid plans only (no free tier)
- More expensive but reliable

---

## 📞 Need Help?

1. **Check Railway Logs** (most important!)
2. **Check this guide** for common issues
3. **Railway Docs:** https://docs.railway.app
4. **Railway Discord:** https://discord.gg/railway

---

## ✅ Deployment Checklist

Before deploying, make sure:
- [x] Code is pushed to GitHub
- [x] `package.json` has all dependencies
- [x] `server.js` uses `process.env.PORT || 3000`
- [x] `/api/health` endpoint exists
- [x] `railway.json` is configured
- [x] `nixpacks.toml` is configured
- [x] `.env` is in `.gitignore` (don't commit secrets!)
- [x] `libs/` folder is in repository (for offline version)

---

**Your app is ready to deploy! 🚀**
