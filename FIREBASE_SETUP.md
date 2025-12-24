# 🔥 Firebase Setup Guide - Shared Database

## Why Firebase?

Firebase Firestore provides:
- ✅ **Shared database** - All computers see the same data
- ✅ **Real-time sync** - Changes appear instantly on all devices
- ✅ **Offline support** - Works offline, syncs when online
- ✅ **Free tier** - Generous free quota for small businesses
- ✅ **Secure** - Built-in security rules

---

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Project

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Sign in with Google account (free)

2. **Create New Project:**
   - Click "Add project" or "Create a project"
   - Enter project name: `supermarket-pos` (or your choice)
   - Disable Google Analytics (optional, can enable later)
   - Click "Create project"
   - Wait for project creation (30 seconds)

### Step 2: Enable Firestore Database

1. **In Firebase Console:**
   - Click "Firestore Database" in left menu
   - Click "Create database"

2. **Choose Mode:**
   - Select "Start in **test mode**" (for now)
   - Click "Next"

3. **Choose Location:**
   - Select closest region (e.g., `us-central`, `europe-west`)
   - Click "Enable"
   - Wait for database creation

### Step 3: Get Your Firebase Config

1. **In Firebase Console:**
   - Click the gear icon ⚙️ (Project settings)
   - Scroll down to "Your apps"
   - Click the web icon `</>` (Add app)

2. **Register App:**
   - App nickname: `Supermarket POS`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Config:**
   - You'll see a code block with your config
   - Copy the `firebaseConfig` object
   - It looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### Step 4: Update Your Files

1. **Open `firebase-config.js`:**
   - Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. with your actual values
   - Save the file

2. **Add Firebase Scripts:**
   - The system will automatically load Firebase from CDN
   - No additional installation needed!

### Step 5: Set Up Security Rules

1. **In Firebase Console:**
   - Go to "Firestore Database" → "Rules" tab
   - Replace the rules with:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to all documents
       // For production, you should add authentication
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

2. **Click "Publish"**

   ⚠️ **Note:** These rules allow anyone to read/write. For production, add authentication.

---

## 🔒 Production Security Rules (Recommended)

For better security, use these rules with authentication:

```javascript
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
     // Products collection
     match /products/{productId} {
       allow read: if true;  // Anyone can read
       allow write: if request.auth != null;  // Only authenticated users can write
     }
     
     // Sales collection
     match /sales/{saleId} {
       allow read, write: if request.auth != null;
     }
     
     // Customers collection
     match /customers/{customerId} {
       allow read, write: if request.auth != null;
     }
     
     // Suppliers collection
     match /suppliers/{supplierId} {
       allow read, write: if request.auth != null;
     }
     
     // Purchases collection
     match /purchases/{purchaseId} {
       allow read, write: if request.auth != null;
     }
     
     // Invoices collection
     match /invoices/{invoiceId} {
       allow read, write: if request.auth != null;
     }
   }
 }
```

---

## ✅ Verify Setup

1. **Deploy to Netlify:**
   - Deploy your updated files
   - Make sure `firebase-config.js` is included

2. **Test:**
   - Open your site on two different computers
   - Add a product on Computer 1
   - Check if it appears on Computer 2 (should appear instantly!)

---

## 📊 Firebase Free Tier Limits

Firebase Free Tier includes:
- **50,000 reads/day**
- **20,000 writes/day**
- **20,000 deletes/day**
- **1 GB storage**

**For a small supermarket:** This is usually enough!

**If you exceed:** Firebase will notify you, and you can upgrade to Blaze plan (pay-as-you-go).

---

## 🔄 How It Works

### Online Mode:
- All data syncs to Firebase in real-time
- All computers see changes instantly
- Data is stored in cloud

### Offline Mode:
- Firebase caches data locally
- System works offline
- Changes queue up
- When online, changes sync automatically

---

## 🆘 Troubleshooting

### Data Not Syncing:
1. Check Firebase config is correct
2. Check browser console (F12) for errors
3. Verify Firestore is enabled
4. Check security rules are published

### "Permission Denied" Error:
- Check security rules
- Make sure rules are published
- For test mode, rules should allow read/write

### Slow Sync:
- Check internet connection
- Firebase syncs in real-time (usually instant)
- Large data might take a few seconds

---

## 📞 Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Console: https://console.firebase.google.com

---

**Once set up, all computers will share the same database! 🎉**

