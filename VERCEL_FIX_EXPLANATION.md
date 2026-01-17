# Vercel NOT_FOUND Error - Fix Explanation

## 🔍 Root Cause Analysis

### The Problem
Your Vercel deployment was returning `NOT_FOUND` errors because:

1. **Wrong Export Format**: `api/index.js` was exporting an Express app directly (`module.exports = app`), but Vercel serverless functions require a **handler function**.

2. **Path Routing Mismatch**: The Express routes had `/api` prefix, but Vercel's routing already strips the `/api` part when forwarding to the handler.

### What Was Happening
```
User Request: GET /api/health
    ↓
Vercel Routing: Routes to /api/index.js
    ↓
Handler Receives: Path = "/health" (without /api)
    ↓
Express Route: Looking for "/api/health" ❌ NOT FOUND
```

### The Fix
1. **Wrapped Express app with `serverless-http`**: This converts the Express app into a proper Vercel handler function
2. **Removed `/api` prefix from routes**: Since Vercel already routes `/api/*` to this function, the paths are relative
3. **Added `serverless-http` dependency**: Required package for the wrapper

## 📚 Understanding Serverless Functions

### Traditional Express Server
```javascript
// server.js
const app = express();
app.get('/api/health', handler);
app.listen(3000); // Long-running process
```

### Vercel Serverless Function
```javascript
// api/index.js
const app = express();
app.get('/health', handler); // No /api prefix needed
module.exports = serverless(app); // Export handler function
```

**Key Differences:**
- **No `app.listen()`**: Vercel manages the server
- **Handler function**: Must export a function, not the app
- **Stateless**: Each request may use a new function instance
- **Path handling**: Vercel routing affects the path your app receives

## 🎯 Mental Model

Think of Vercel serverless functions as:
- **Event handlers**: Each HTTP request is an event
- **Stateless**: No shared memory between requests (unless using external storage)
- **Auto-scaling**: Vercel creates/destroys instances as needed
- **Path-aware**: The routing configuration determines what path your function receives

## ⚠️ Warning Signs to Watch For

### 1. Exporting Express App Directly
```javascript
// ❌ WRONG
module.exports = app;

// ✅ CORRECT
module.exports = serverless(app);
```

### 2. Double Path Prefixes
```javascript
// ❌ WRONG (if Vercel routes /api/* to this)
app.get('/api/health', handler);

// ✅ CORRECT
app.get('/health', handler);
```

### 3. Using `app.listen()`
```javascript
// ❌ WRONG (Vercel manages the server)
app.listen(3000);

// ✅ CORRECT (Remove listen, Vercel handles it)
// Just export the handler
```

### 4. Missing Static File Handling
```javascript
// ❌ WRONG (Trying to serve static files in serverless)
app.use(express.static(__dirname));

// ✅ CORRECT (Let Vercel handle static files via vercel.json routing)
// Static files are served automatically
```

## 🔄 Alternative Approaches

### Option 1: serverless-http (Current Solution) ✅
**Pros:**
- Minimal code changes
- Works with existing Express apps
- Handles all Express features

**Cons:**
- Additional dependency
- Slight performance overhead

### Option 2: Individual API Route Files
Create separate files for each route:
```
api/
  health.js
  mpesa/
    status.js
    stkpush.js
```

**Pros:**
- Better performance (smaller bundles)
- Clearer separation of concerns
- Vercel-optimized

**Cons:**
- More files to manage
- Code duplication for shared logic

### Option 3: Manual Handler Function
```javascript
module.exports = async (req, res) => {
  // Manual routing logic
  if (req.url === '/health') {
    // handle health
  }
};
```

**Pros:**
- No dependencies
- Full control

**Cons:**
- More boilerplate
- Manual routing logic

## 📝 Code Changes Made

1. **package.json**: Added `serverless-http` dependency
2. **api/index.js**: 
   - Imported `serverless-http`
   - Removed `/api` prefix from all routes
   - Changed export to `module.exports = serverless(app)`
   - Fixed callback URL configuration

## ✅ Testing the Fix

After deploying, test these endpoints:
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/mpesa/status`
- `https://your-app.vercel.app/` (should serve complete-system.html)

## 🚀 Next Steps

1. Commit and push these changes
2. Vercel will auto-deploy (if GitHub integration is set up)
3. Or manually redeploy in Vercel dashboard
4. Test the endpoints
5. Set environment variables for M-Pesa (if needed)

---

**Remember**: Serverless functions are different from traditional servers. Always export a handler function, not the app itself!


