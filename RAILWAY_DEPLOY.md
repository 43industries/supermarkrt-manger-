# 🚂 Deploy to Railway (Recommended for Full-Stack)

Railway is the **best option** for your POS system because it fully supports:
- ✅ Node.js/Express backend
- ✅ SQLite database (persistent storage)
- ✅ All your API endpoints
- ✅ User authentication
- ✅ Complete functionality

---

## 🚀 Quick Deploy (5 Minutes!)

### Option 1: Web UI (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "POS System - Ready for Railway"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Railway:**
   - Visit: https://railway.app
   - Click "Start a New Project"
   - Sign up with GitHub (free)

3. **Deploy:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js!
   - Click "Deploy"

4. **Get your URL:**
   - Railway provides: `https://your-app.up.railway.app`
   - Your system is live! 🎉

5. **Set environment variables (if needed):**
   - Go to your project → Variables
   - Add any `.env` variables (MPesa keys, etc.)

---

### Option 2: Railway CLI (For Updates)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy:**
   ```bash
   railway init
   railway up
   ```

4. **Get URL:**
   ```bash
   railway domain
   ```

---

## 📋 What Railway Does Automatically

- ✅ Detects Node.js
- ✅ Runs `npm install`
- ✅ Runs `npm start`
- ✅ Provides HTTPS URL
- ✅ Handles SSL certificates
- ✅ Scales automatically
- ✅ Provides persistent storage (SQLite works!)

---

## 🔧 Configuration

### Environment Variables

If you have a `.env` file, add variables in Railway:

1. Go to your project → **Variables** tab
2. Click **New Variable**
3. Add each variable:
   - `PORT` (optional, Railway sets automatically)
   - `MPESA_CONSUMER_KEY` (if using M-Pesa)
   - `MPESA_CONSUMER_SECRET`
   - Any other variables

### Port Configuration

Railway sets `PORT` automatically. Your `server.js` already uses:
```javascript
const PORT = process.env.PORT || 3000;
```
This works perfectly! ✅

---

## 📊 Railway Free Tier

- ✅ **$5 credit/month** (plenty for small apps)
- ✅ **100 hours runtime** (more than enough)
- ✅ **Persistent storage** (SQLite database files)
- ✅ **Custom domains** (free)
- ✅ **SSL certificates** (free)

**For production:** Upgrade to paid plan ($5-20/month)

---

## 🎯 After Deployment

1. **Test your system:**
   - Visit: `https://your-app.up.railway.app`
   - Login with: `admin / admin123`
   - Test features

2. **Add custom domain (optional):**
   - Go to project → **Settings** → **Domains**
   - Add your domain
   - Railway handles SSL automatically

3. **Monitor:**
   - Railway dashboard shows logs
   - Monitor resource usage
   - View deployments

---

## 🔄 Updating Your App

**Via GitHub (Recommended):**
- Just push changes to GitHub
- Railway auto-deploys! ✅

**Via CLI:**
```bash
railway up
```

---

## 🆘 Troubleshooting

### Database not working?
- ✅ Railway supports SQLite (persistent storage)
- ✅ Database file is saved between deployments
- ✅ Check logs in Railway dashboard

### App not starting?
- Check Railway logs (in dashboard)
- Verify `package.json` has `"start": "node server.js"`
- Check environment variables

### Port errors?
- Railway sets `PORT` automatically
- Your code already uses `process.env.PORT || 3000` ✅

---

## 📝 Summary

**Railway is perfect for your system because:**
- ✅ Full Node.js support
- ✅ SQLite database works perfectly
- ✅ Free tier available
- ✅ Easy deployment (Git push)
- ✅ Auto-deploy on changes
- ✅ Custom domains & SSL

**Deploy now:** https://railway.app

---

## 🎉 You're Live!

Your POS system is now running on Railway with:
- ✅ Full backend functionality
- ✅ Database persistence
- ✅ User authentication
- ✅ All features working
- ✅ HTTPS/SSL enabled

**Next steps:**
1. Test all features
2. Add custom domain (optional)
3. Set up environment variables (if needed)
4. Start using your system!

---

**Need help?** Railway Docs: https://docs.railway.app
