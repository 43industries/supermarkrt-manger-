# 🧪 System Testing Checklist

## ✅ BASIC FUNCTIONALITY TEST (10 minutes)

### Test 1: Login System
- [ ] Open http://localhost:3000
- [ ] See the login screen with supermarket icon
- [ ] Login with: `admin` / `admin123`
- [ ] Successfully logged in → See dashboard

**✅ PASS** | **❌ FAIL** (describe issue): _________________

---

### Test 2: Dashboard
- [ ] See 4 metric cards (Revenue, Profit, Inventory, Low Stock)
- [ ] Numbers are displayed
- [ ] See "Low Stock Alert" section (Rice, Oil, Milk, Bread should show as low)
- [ ] See "Recent Sales" table with demo data
- [ ] Click "Export CSV" button → Downloads a file

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 3: Point of Sale (POS) - MOST IMPORTANT!
- [ ] Click "Point of Sale" tab at top
- [ ] See product grid on left (Rice, Oil, Sugar, Milk, Bread, Tea)
- [ ] See empty shopping cart on right

#### Add Products to Cart:
- [ ] Click on "Rice 5kg" → Appears in cart
- [ ] Click on "Sugar 1kg" → Appears in cart
- [ ] Cart shows 2 items
- [ ] See total price at bottom

#### Test Cart Controls:
- [ ] Click + button on Rice → Quantity increases to 2
- [ ] Click - button on Rice → Quantity decreases to 1
- [ ] Click × (remove) on Sugar → Removed from cart

#### Test Search:
- [ ] Type "milk" in search box → Only milk product shows
- [ ] Clear search → All products show again

#### Test Barcode Scanner:
- [ ] Click in "Scan barcode" field
- [ ] Type: `8901234567892` (Sugar's barcode)
- [ ] Click "Scan" button → Sugar added to cart

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 4: Complete a Sale
**With items in cart:**
- [ ] Select payment method (Cash/Card/M-Pesa) → Button highlights
- [ ] Optionally select a customer (John Doe) from dropdown
- [ ] Click "Complete Sale" button
- [ ] Receipt modal pops up showing:
  - [ ] Store name "SUPERMARKET"
  - [ ] Date and time
  - [ ] Items purchased
  - [ ] Total amount
  - [ ] Payment method
  - [ ] Loyalty points (if customer selected)

#### Test Receipt:
- [ ] Click "Print" → Browser print dialog opens
- [ ] Click "Close" → Modal closes, cart is empty

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 5: Data Persistence (CRITICAL!)
- [ ] Make a sale (any items)
- [ ] Note the total from dashboard
- [ ] **Refresh the page** (F5 or Ctrl+R)
- [ ] Login again
- [ ] Check dashboard → Sale is still there!
- [ ] Check products → Stock levels updated!

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 6: Product Management (Admin Only)
- [ ] Click "Products" tab
- [ ] See table with all products
- [ ] Click "Add Product" button → Form appears

#### Add a Test Product:
- [ ] Fill in:
  - Name: "Test Cola 500ml"
  - Barcode: "9999999999999"
  - Category: "Beverages"
  - Supplier: "Test Supplier"
  - Cost Price: 30
  - Selling Price: 50
  - Stock: 100
  - Reorder Level: 10
- [ ] Click "Save Product"
- [ ] New product appears in table
- [ ] Go to POS → New product appears there too!

#### Edit Product:
- [ ] Click edit icon (pencil) on Test Cola
- [ ] Change price to 55
- [ ] Click "Save Product"
- [ ] Price updated in table

#### Delete Product:
- [ ] Click delete icon (trash) on Test Cola
- [ ] Confirm deletion
- [ ] Product removed from list

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 7: Customer Management
- [ ] Click "Customers" tab
- [ ] See customer cards (John, Jane, Bob)
- [ ] Each shows: Name, phone, email, points, total spent
- [ ] Click "Add Customer" button

#### Add Test Customer:
- [ ] Fill in:
  - Name: "Test Customer"
  - Phone: "+254700999888"
  - Email: "test@example.com"
- [ ] Click "Save Customer"
- [ ] New customer card appears

#### Test Customer Loyalty:
- [ ] Go to POS
- [ ] Add a product (e.g., Rice) to cart
- [ ] Select "Test Customer" from dropdown
- [ ] Complete sale
- [ ] In receipt, see loyalty points earned
- [ ] Go back to Customers tab
- [ ] Test Customer now has points!

#### Edit & Delete:
- [ ] Click edit icon on Test Customer → Can edit
- [ ] Click delete icon → Customer removed

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 8: Reports (Admin Only)
- [ ] Click "Reports" tab
- [ ] See 3 summary cards (Total Revenue, Total Profit, Total Transactions)
- [ ] See "All Sales Transactions" table
- [ ] Should include your test sales
- [ ] Click "Export Full Report" → Downloads CSV

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 9: User Roles
- [ ] Logout (click Logout button top-right)
- [ ] Login as: `cashier` / `cashier123`
- [ ] Notice fewer tabs (no Products, Suppliers, or Reports)
- [ ] Can access: Dashboard, POS, Customers
- [ ] Try to make a sale → Works!
- [ ] Logout

**✅ PASS** | **❌ FAIL**: _________________

---

### Test 10: Low Stock Alerts
- [ ] Login as admin
- [ ] Go to Dashboard
- [ ] See red alert box showing products with low stock
- [ ] Should show: Cooking Oil (8 units), Milk (5 units)
- [ ] Go to Products
- [ ] Low stock items have red text in Stock column

**✅ PASS** | **❌ FAIL**: _________________

---

## 🎯 REAL-WORLD SCENARIO TEST (5 minutes)

**Simulate a real customer purchase:**

1. **Customer walks in**
   - [ ] Go to POS

2. **Customer buys:**
   - [ ] 2× Rice 5kg
   - [ ] 1× Cooking Oil 2L
   - [ ] 3× Sugar 1kg
   - [ ] 1× Milk 1L

3. **Customer has loyalty card (Jane Smith)**
   - [ ] Select "Jane Smith" from dropdown
   - [ ] See her current points (780)

4. **Customer pays with M-Pesa**
   - [ ] Select M-Pesa payment method
   - [ ] Click "Complete Sale"

5. **Print Receipt**
   - [ ] Receipt shows all items
   - [ ] Shows loyalty points earned
   - [ ] Shows new total points
   - [ ] Print works (or close modal)

6. **Verify Everything Updated:**
   - [ ] Go to Dashboard → New sale appears in Recent Sales
   - [ ] Revenue and profit increased
   - [ ] Go to Products → Stock reduced correctly:
     - Rice: 45 → 43
     - Oil: 8 → 7
     - Sugar: 120 → 117
     - Milk: 5 → 4
   - [ ] Go to Customers → Jane's points increased
   - [ ] Jane's total spent increased

**✅ PASS** | **❌ FAIL**: _________________

---

## 📊 TEST RESULTS SUMMARY

**Total Tests:** 11 (10 basic + 1 real-world)

**Passed:** ___ / 11

**Failed:** ___ / 11

**Critical Issues:** (list any major problems)
- _____________________________________
- _____________________________________
- _____________________________________

**Minor Issues:** (small bugs or suggestions)
- _____________________________________
- _____________________________________
- _____________________________________

---

## 🎉 SUCCESS CRITERIA

**READY FOR PRODUCTION if:**
- ✅ 10/11 or 11/11 tests pass
- ✅ POS (Test 3 & 4) works perfectly
- ✅ Data persistence (Test 5) works
- ✅ Sales complete and print receipts
- ✅ Stock updates automatically

**NEEDS FIXES if:**
- ❌ Less than 9/11 tests pass
- ❌ POS not working
- ❌ Data loss on refresh
- ❌ Can't complete sales

**OPTIONAL IMPROVEMENTS if:**
- ⚠️ Minor UI issues
- ⚠️ Slow performance
- ⚠️ Small bugs that don't affect core functionality

---

## 🆘 COMMON ISSUES & SOLUTIONS

### Issue: "Page won't load"
**Check:**
- Is server running? Look for "npx serve" window
- Try: http://localhost:3000/index.html
- Try different port: http://127.0.0.1:3000

### Issue: "Can't login"
**Solution:**
- Check Caps Lock is OFF
- Try: admin / admin123 (exactly)
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Products not showing in POS"
**Solution:**
- Refresh the page
- Check browser console (F12) for errors
- Make sure products exist (check Products tab)

### Issue: "Data disappeared after refresh"
**Solution:**
- Check if localStorage is enabled
- F12 → Application → Local Storage → Should see data
- Don't use Incognito/Private mode

### Issue: "Receipt won't print"
**Solution:**
- Check if printer is set up
- Browser print dialog should appear
- Can save as PDF instead

### Issue: "Barcode scanner not working"
**Solution:**
- Make sure scanner is plugged in
- Click in the "Scan barcode" input field first
- Scanner should type numbers automatically

---

## ✅ AFTER TESTING

### If All Tests Pass:
1. **You're ready!** System is production-ready
2. Follow `STORE_OWNER_QUICKSTART.md` to set up for real use
3. Change passwords and clear demo data
4. Add your real products

### If Some Tests Fail:
1. **Note which tests failed** (write in summary above)
2. **Tell me what happened** - I'll fix it immediately
3. **Check browser console** (F12) for error messages
4. **Take a screenshot** if helpful

---

## 💬 REPORT YOUR RESULTS

After testing, tell me:

✅ **"All tests passed!"** → Great! Ready for production setup?

⚠️ **"Most passed but..."** → Tell me what issues you found

❌ **"Having problems with..."** → Describe the issue, I'll help fix it

**Test now and let me know how it goes!** 🚀

---

## 🎯 NEXT STEPS AFTER TESTING

**If everything works:**
1. Read `STORE_OWNER_QUICKSTART.md`
2. Change passwords (for security)
3. Clear demo data
4. Add your real products (start with 5-10)
5. Train one staff member
6. Start using it!

**You've got this! 🎉**

