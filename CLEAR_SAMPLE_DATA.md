# 🗑️ Clear Sample Data - Start Fresh

## ⚠️ Important: This will delete all sample data!

This guide helps you clear all the demo/sample data from your system so you can start with your real shop data.

---

## 🎯 What Will Be Deleted

**The following data will be cleared:**
- ❌ All Products (sample products)
- ❌ All Sales (sample sales)
- ❌ All Customers (sample customers)
- ❌ All Suppliers (sample suppliers)
- ❌ All Expenses (sample expenses)
- ❌ All Purchases (sample purchases)
- ❌ All Invoices (sample invoices)
- ❌ All Returns (sample returns)
- ❌ All Activity Logs
- ❌ All Admin Notifications

**The following will be KEPT:**
- ✅ All Users (admin, samuel, michael)
- ✅ User passwords
- ✅ System settings

---

## 🚀 Option 1: Use the Clear Script (Recommended)

### Step 1: Stop the Server

If the server is running, stop it (Ctrl+C).

### Step 2: Run the Clear Script

```bash
node clear-sample-data.js
```

### Step 3: Confirm

Type `yes` when prompted to confirm deletion.

### Step 4: Done!

Sample data is cleared. Start the server and add your real data.

---

## 🗄️ Option 2: Delete Database and Start Fresh

### Step 1: Stop the Server

If the server is running, stop it (Ctrl+C).

### Step 2: Delete Database File

**Windows:**
```bash
del supermarket.db
del supermarket.db-shm
del supermarket.db-wal
```

**Or manually:**
- Go to the project folder
- Delete `supermarket.db`
- Delete `supermarket.db-shm` (if exists)
- Delete `supermarket.db-wal` (if exists)

### Step 3: Start Server

```bash
npm start
```

The database will be recreated with empty tables (only users will be seeded).

---

## 🔧 Option 3: Clear Data via Database Tool

If you have a SQLite database tool (like DB Browser for SQLite):

1. Open `supermarket.db`
2. Delete rows from these tables:
   - `products`
   - `sales`
   - `sale_items`
   - `customers`
   - `suppliers`
   - `expenses`
   - `purchases`
   - `invoices`
   - `returns`
   - `return_items`
   - `activity_logs`
   - `admin_notifications`
3. Keep `users` table intact
4. Save and close

---

## 📝 After Clearing Data

### 1. Start the Server

```bash
npm start
```

### 2. Login

- **Admin:** `admin` / `Emma@123`
- **Samuel:** `samuel` / `samuel123`
- **Michael:** `michael` / `michael123`

### 3. Add Your Real Data

1. **Add Products:**
   - Go to **Products & Prices**
   - Click **Add Product**
   - Enter your real products with correct prices and stock

2. **Add Customers (Optional):**
   - Go to **Customers**
   - Click **Add Customer**
   - Enter your real customers

3. **Add Suppliers (Optional):**
   - Go to **Suppliers**
   - Click **Add Supplier**
   - Enter your real suppliers

4. **Start Making Sales:**
   - Go to **Point of Sale**
   - Start making real sales!
   - All sales will be recorded with correct dates

---

## ⚠️ Important Notes

### Date & Time

**Make sure your system date/time is correct!**

The system uses your computer's date/time for:
- Sale dates
- Reports
- Receipts

**To check/fix date/time:**
- Windows: Settings → Time & Language → Date & Time
- Make sure "Set time automatically" is enabled
- Current date shows: **January 11, 2026** (verify this is correct!)

### Backup First (Optional)

If you want to keep a backup of current data:

1. **Backup database file:**
   ```bash
   copy supermarket.db supermarket-backup.db
   ```

2. **Or export data:**
   - Login to the system
   - Go to **Reports**
   - Export data to CSV (if available)

---

## ✅ Verification

After clearing data:

1. **Check Products:**
   - Go to **Products & Prices**
   - Should be empty (or show your real products)

2. **Check Sales:**
   - Go to **Reports** or **Dashboard**
   - Should show no sales (or your real sales)

3. **Check Customers:**
   - Go to **Customers**
   - Should be empty (or show your real customers)

4. **Check Users:**
   - Go to **Settings** → **User Accounts**
   - Should still show: admin, samuel, michael

---

## 🎉 Ready to Use!

Once sample data is cleared:

- ✅ System is empty and ready
- ✅ Users are still available
- ✅ You can add your real products
- ✅ You can start making real sales
- ✅ Reports will reflect your real shop data

**Your system will now be a true reflection of your shop!** 🚀

---

## 🆘 Need Help?

If you need to restore sample data:
1. Delete `supermarket.db`
2. Restart server
3. Sample data will be seeded again

But for real shop use, **keep it cleared** and add your own data!
