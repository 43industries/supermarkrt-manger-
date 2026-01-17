# ⚡ Quick Deploy to Internet - 5 Minutes!

## 🎯 Recommended: Railway (Best for Full-Stack)

Your POS system needs a **full-stack hosting** solution because it has:
- ✅ Node.js/Express backend server
- ✅ SQLite database  
- ✅ API endpoints
- ✅ User authentication

**Railway is perfect** because it supports all of these!

---

## 🚀 Step-by-Step (5 Minutes)

### Step 1: Push Code to GitHub (2 minutes)

**If you don't have GitHub yet:**
1. Go to: https://github.com/signup
2. Create free account
3. Verify email

**Push your code:**

Open **PowerShell** or **Terminal** in your project folder (`D:\surematress`):

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "POS System - Ready for deployment"

# Create repository on GitHub first, then:
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/supermarket-pos.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Go to: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select "repo" permissions
  - Copy token and use as password

---

### Step 2: Deploy to Railway (3 minutes)

1. **Go to Railway:**
   - Visit: https://railway.app
   - Click **"Start a New Project"**
   - Click **"Login with GitHub"** (free)

2. **Deploy:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Authorize Railway (if asked)
   - Find your repository: `supermarket-pos`
   - Click on it

3. **Wait:**
   - Railway auto-detects Node.js ✅
   - Runs `npm install` automatically ✅
   - Runs `npm start` automatically ✅
   - Takes 1-2 minutes

4. **Get URL:**
   - Railway gives you: `https://your-app.up.railway.app`
   - Click the URL
   - ✅ **Your POS system is LIVE!**

---

## 🎉 Done!

**Your system is now:**
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ HTTPS secured
- ✅ Full functionality working
- ✅ Database persistent

**Login with:**
- Username: `admin`
- Password: `admin123`

---

## 🔄 Update Your Site

After making changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Railway **automatically redeploys!** ✅

---

## 🌐 Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Railway:
   - Go to your project
   - Click **"Settings"** → **"Domains"**
   - Click **"Add Custom Domain"**
   - Follow instructions

---

## ⚙️ Environment Variables (Optional - For M-Pesa)

If you're using M-Pesa:

1. In Railway dashboard:
   - Go to your project → **"Variables"** tab
   - Click **"New Variable"**
   - Add:
     - `MPESA_CONSUMER_KEY=your_key`
     - `MPESA_CONSUMER_SECRET=your_secret`
     - `MPESA_SHORTCODE=your_shortcode`
     - `MPESA_PASSKEY=your_passkey`
     - `MPESA_ENVIRONMENT=sandbox`

2. Redeploy (Railway → Deployments → ... → Redeploy)

---

## 🆘 Troubleshooting

**App not starting?**
- Check Railway logs: Dashboard → Deployments → Logs
- Make sure `package.json` has `"start": "node server.js"`

**Can't access site?**
- Check deployment status (should be "Active")
- Try incognito/private window
- Check URL is correct

**Database errors?**
- Railway supports SQLite ✅
- Database file is created automatically ✅
- Check logs for specific errors

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway

---

## 🎯 Quick Links

- **Railway:** https://railway.app
- **GitHub:** https://github.com/new
- **Your Railway Dashboard:** https://railway.app/dashboard

---

**Ready? Start with Step 1!** 🚀

