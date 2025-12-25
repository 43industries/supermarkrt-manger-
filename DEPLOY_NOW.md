# 🚀 Deploy to Vercel - Step by Step

Your code is already on GitHub! Follow these steps to deploy:

## Step 1: Go to Vercel
1. Open your browser and go to: **https://vercel.com/new**
2. Click **"Sign up"** or **"Log in"** (use GitHub to sign in for easiest setup)

## Step 2: Import Your Repository
1. After logging in, you'll see **"Import Git Repository"**
2. Click **"Import"** next to your repository: `43industries/supermarkrt-manger-`
   - If you don't see it, click **"Adjust GitHub App Permissions"** and grant access

## Step 3: Configure Project
1. **Project Name**: `supermarket-pos` (or leave default)
2. **Framework Preset**: Vercel will auto-detect (Node.js)
3. **Root Directory**: `.` (leave as is)
4. **Build Command**: Leave empty (no build needed)
5. **Output Directory**: Leave empty
6. Click **"Deploy"**

## Step 4: Wait for Deployment
- Vercel will deploy your project (takes 1-2 minutes)
- You'll see a success message with your live URL!

## Step 5: Set Environment Variables (For M-Pesa)
After deployment:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=your_shortcode_here
MPESA_PASSKEY=your_passkey_here
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://your-app-name.vercel.app/api/mpesa/callback
```

4. After adding variables, go to **"Deployments"** tab
5. Click the **"..."** menu on the latest deployment
6. Click **"Redeploy"** to apply the environment variables

## Step 6: Test Your Deployment
Visit your live URL (e.g., `https://supermarket-pos.vercel.app`)

Test endpoints:
- Health: `https://your-app.vercel.app/api/health`
- M-Pesa Status: `https://your-app.vercel.app/api/mpesa/status`

## ✅ Done!
Your supermarket POS system is now live on Vercel!

---

**Quick Link**: https://vercel.com/new

