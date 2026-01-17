# 🌐 Deploy Your POS System to the Internet

## 🎯 Best Option: Railway (Recommended)

**Why Railway?**
- ✅ Full Node.js/Express backend support
- ✅ SQLite database works perfectly (persistent storage)
- ✅ All your API endpoints work
- ✅ User authentication works
- ✅ Free tier available ($5 credit/month)
- ✅ Easy deployment
- ✅ Custom domains & SSL

---

## 🚀 Quick Deployment (5 Minutes!)

### Option 1: Deploy with GitHub (Recommended - 5 minutes)

#### Step 1: Create GitHub Repository (2 minutes)

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Sign in or create account (free)

2. **Create new repository:**
   - Repository name: `supermarket-pos` (or any name)
   - Make it **Private** (recommended) or Public
   - **Don't** initialize with README (we already have files)
   - Click **"Create repository"**

3. **Push your code to GitHub:**
   
   Open PowerShell/Terminal in your project folder (`D:\surematress`):
   
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit files
   git commit -m "Initial commit - POS System ready for deployment"
   
   # Add GitHub repository (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/supermarket-pos.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```
   
   **Note:** If you get prompted for credentials, use a Personal Access Token (see GitHub settings)

#### Step 2: Deploy to Railway (3 minutes)

1. **Go to Railway:**
   - Visit: https://railway.app
   - Click **"Start a New Project"**
   - Sign up with **GitHub** (free and easiest)

2. **Deploy your repository:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub
   - Find and select your repository: `supermarket-pos`
   - Click **"Deploy"**

3. **Wait for deployment:**
   - Railway will automatically:
     - Detect Node.js
     - Run `npm install`
     - Run `npm start`
     - Provide a live URL (takes 1-2 minutes)

4. **Get your URL:**
   - Railway provides: `https://your-app.up.railway.app`
   - Click the URL to open your live site!
   - ✅ **Your POS system is now live on the internet!**

---

### Option 2: Deploy without GitHub (Alternative - Manual Upload)

If you don't want to use GitHub:

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```
   (Opens browser to authenticate)

3. **Initialize and deploy:**
   ```bash
   # In your project folder (D:\surematress)
   railway init
   railway up
   ```

4. **Get your URL:**
   ```bash
   railway domain
   ```

---

## ⚙️ Configuration

### Environment Variables (Optional - For M-Pesa)

If you're using M-Pesa integration, add environment variables:

1. **In Railway Dashboard:**
   - Go to your project
   - Click **"Variables"** tab
   - Click **"New Variable"**
   - Add each variable:

```
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=your_shortcode_here
MPESA_PASSKEY=your_passkey_here
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://your-app.up.railway.app/api/mpesa/callback
```

2. **Redeploy:**
   - After adding variables, go to **"Deployments"**
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

---

## 🎯 What Works After Deployment

✅ **Full Backend:**
- All API endpoints work
- Database persistence (SQLite)
- User authentication
- Sales tracking
- Product management

✅ **All Features:**
- POS system
- Inventory management
- Sales reports
- User management
- Multi-branch support (if configured)

✅ **Security:**
- HTTPS/SSL enabled automatically
- Secure connection
- CORS configured

---

## 📊 Railway Free Tier

**What you get for FREE:**
- ✅ $5 credit/month (plenty for small apps)
- ✅ 100 hours runtime (more than enough)
- ✅ Persistent storage (SQLite database files)
- ✅ Custom domains (free)
- ✅ SSL certificates (free)

**For production:** Upgrade to paid plan ($5-20/month) when needed

---

## 🔄 Updating Your Site

After making changes:

### Via GitHub (Recommended):
1. Make changes to your files
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Railway automatically redeploys! ✅

### Via Railway CLI:
```bash
railway up
```

---

## 🌐 Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy, etc.)

2. **In Railway:**
   - Go to project → **"Settings"** → **"Domains"**
   - Click **"Generate Domain"** (free Railway domain) or
   - Click **"Add Custom Domain"** (your own domain)
   - Follow instructions to add DNS records

3. **SSL is automatic!** Railway handles certificates

---

## 🆘 Troubleshooting

### App not starting?

**Check Railway logs:**
1. Go to Railway dashboard
2. Click your project
3. Click **"Deployments"** tab
4. Click latest deployment
5. View **"Logs"** tab

**Common issues:**
- ❌ Database error → Check database.js file is included
- ❌ Port error → Already handled (`process.env.PORT || 3000`)
- ❌ Missing dependencies → Check `package.json` has all dependencies

### Database not working?

- ✅ Railway supports SQLite (persistent storage)
- ✅ Database file is saved between deployments
- ✅ Check logs for database errors

### Can't access your site?

- Check Railway deployment status (should be "Active")
- Verify URL is correct
- Try incognito/private browser window

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [x] `package.json` exists with dependencies
- [x] `server.js` exists and runs locally
- [x] `database.js` exists
- [x] All HTML files are in root directory
- [x] `libs/` folder exists with required files
- [x] Code works locally (`npm start`)

---

## 🎉 You're Live!

After deployment, your POS system will be:

✅ **Accessible from anywhere**  
✅ **HTTPS secured**  
✅ **Full functionality**  
✅ **Database persistent**  
✅ **Auto-deploying on updates**

**Next steps:**
1. Test all features
2. Share URL with your team
3. Set up custom domain (optional)
4. Add environment variables (if needed)

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Check logs:** Railway dashboard → Deployments → Logs

---

## 🚀 Quick Links

- **Railway:** https://railway.app
- **GitHub:** https://github.com/new
- **Your Railway Dashboard:** https://railway.app/dashboard

---

**Ready to deploy? Start with Option 1 (GitHub + Railway) - it's the easiest!** 🎯

