# Quick Start: Deploy to Vercel

## Fastest Way to Deploy

### Option 1: Using Vercel CLI (2 minutes)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project
cd "E:\supermarket system"

# Deploy
vercel

# For production
vercel --prod
```

### Option 2: Using GitHub (5 minutes)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click Deploy

## Set Environment Variables (For M-Pesa)

After deployment, go to **Settings → Environment Variables** and add:

```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://your-app.vercel.app/api/mpesa/callback
```

Then **redeploy** for changes to take effect.

## Test Your Deployment

Visit: `https://your-project.vercel.app`

Check API: `https://your-project.vercel.app/api/health`

## ⚠️ Important

- **SQLite won't work** - Use browser IndexedDB (already configured) or migrate to cloud database
- **M-Pesa transactions** are stored in-memory (will reset on function restart)

## Need Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions.


