# Vercel Deployment Guide

This guide will help you deploy your Supermarket POS System to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
2. Your project code ready to deploy
3. M-Pesa credentials (optional, for payment integration)

## Important Notes

### ⚠️ Database Limitation

**SQLite databases will NOT work on Vercel** because:
- Vercel's filesystem is read-only (except `/tmp`)
- Database files cannot be written to or persist between deployments
- Each serverless function invocation is stateless

**Solutions:**
- The frontend uses IndexedDB (browser storage) which works fine
- For backend data persistence, consider:
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (Redis)
  - [Supabase](https://supabase.com)
  - [PlanetScale](https://planetscale.com)
  - Other cloud databases

### M-Pesa Transaction Storage

Currently, M-Pesa transactions are stored in-memory (Map), which means:
- Transactions are lost when the serverless function restarts
- For production, migrate to a persistent database (see options above)

## Deployment Steps

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to your project directory**:
   ```bash
   cd "E:\supermarket system"
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: **supermarket-pos** (or your preferred name)
   - Directory: **.** (current directory)
   - Override settings? **No**

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import project in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect the configuration

3. **Configure environment variables** (see below)

4. **Click Deploy**

## Environment Variables

Set these in your Vercel project settings:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required for M-Pesa Integration:

```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENVIRONMENT=sandbox  # or 'production'
MPESA_CALLBACK_URL=https://your-domain.vercel.app/api/mpesa/callback
```

### Optional:

```
NODE_ENV=production
```

**Note:** After adding environment variables, you need to redeploy for changes to take effect.

## Project Structure

```
.
├── api/
│   └── index.js          # Serverless function (Express app)
├── libs/                 # Frontend libraries
├── *.html                # Frontend HTML files
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── .vercelignore         # Files to exclude from deployment
```

## How It Works

1. **Static Files**: HTML, CSS, JS files are served as static assets
2. **API Routes**: All `/api/*` routes are handled by the serverless function in `api/index.js`
3. **Frontend**: The main app (`complete-system.html`) is served at the root URL

## Testing Your Deployment

1. **Check health endpoint**:
   ```
   https://your-project.vercel.app/api/health
   ```

2. **Check M-Pesa status**:
   ```
   https://your-project.vercel.app/api/mpesa/status
   ```

3. **Access the main app**:
   ```
   https://your-project.vercel.app/
   ```

## Updating Your Deployment

### Via CLI:
```bash
vercel --prod
```

### Via GitHub:
- Push changes to your repository
- Vercel will automatically redeploy (if auto-deploy is enabled)

## Troubleshooting

### Issue: "Module not found"
- **Solution**: Ensure all dependencies are in `package.json` and run `npm install` locally to verify

### Issue: "Function timeout"
- **Solution**: Vercel free tier has 10s timeout for Hobby plan. Consider upgrading or optimizing your functions

### Issue: "Environment variables not working"
- **Solution**: 
  1. Check variable names match exactly (case-sensitive)
  2. Redeploy after adding/changing variables
  3. Restart the deployment

### Issue: "Database errors"
- **Solution**: SQLite won't work. Migrate to a cloud database (see Database Limitation section above)

### Issue: "CORS errors"
- **Solution**: CORS is already configured in the Express app. If issues persist, check your frontend URL matches the deployment URL

## Custom Domain

1. Go to **Settings** → **Domains** in Vercel Dashboard
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `MPESA_CALLBACK_URL` environment variable with your custom domain

## Monitoring

- View logs in Vercel Dashboard → **Deployments** → Click on a deployment → **Functions** tab
- Set up error tracking with [Sentry](https://sentry.io) or similar

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

## Next Steps

1. ✅ Deploy to Vercel
2. ⚠️ Set up environment variables for M-Pesa
3. ⚠️ Migrate database to cloud solution (if needed)
4. ⚠️ Set up custom domain (optional)
5. ⚠️ Configure monitoring and error tracking

---

**Ready to deploy?** Run `vercel` in your project directory!


