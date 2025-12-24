# Customization Guide

## Quick Customizations You Can Make Right Now

### 1. Change Company Name & Branding

**File:** `supemarket` (line ~247)

Change:
```javascript
<h2 className="text-2xl font-bold">SUPERMARKET</h2>
```

To:
```javascript
<h2 className="text-2xl font-bold">YOUR STORE NAME</h2>
```

### 2. Update Tax PIN Number

**File:** `supemarket` (line ~249)

Change:
```javascript
<p className="text-xs text-gray-500 mt-1">PIN: P051234567X</p>
```

To your actual tax PIN.

### 3. Modify Loyalty Points Calculation

**File:** `supemarket` (line ~117)

Change:
```javascript
const pointsEarned = Math.floor(total / 10); // 1 point per 10 KES
```

To whatever ratio you want:
```javascript
const pointsEarned = Math.floor(total / 20); // 1 point per 20 KES
```

### 4. Add Your Actual Products

**File:** `supemarket` (lines 10-17)

Replace the demo products with your real inventory:
```javascript
const [products, setProducts] = useState([
  { 
    id: 1, 
    name: 'Your Product Name', 
    barcode: '1234567890123', 
    category: 'Category', 
    costPrice: 100, 
    sellingPrice: 150, 
    stock: 50, 
    reorderLevel: 10, 
    supplier: 'Your Supplier' 
  },
  // Add more products...
]);
```

### 5. Change Currency

Search for "KES" throughout the file and replace with your currency:
- KES → USD
- KES → EUR
- KES → GBP
- etc.

### 6. Customize Colors

The system uses Tailwind CSS. You can change colors by modifying class names:

**Blue theme (current):** `bg-blue-600`, `text-blue-600`, `border-blue-600`
**Green theme:** `bg-green-600`, `text-green-600`, `border-green-600`
**Purple theme:** `bg-purple-600`, `text-purple-600`, `border-purple-600`

### 7. Add Your Suppliers

**File:** `supemarket` (lines 19-24)

Replace with your actual suppliers.

### 8. Update Contact Information

Add your store's address, phone number, and email to the receipt section.

### 9. Modify Low Stock Threshold

You can set individual reorder levels for each product when adding/editing products.

### 10. Change Login Credentials

**File:** `supemarket` (lines 47-50)

**⚠️ Important:** In production, NEVER store passwords in plain text!

For demo purposes only:
```javascript
const users = [
  { username: 'youradmin', password: 'newpassword', role: 'Admin', name: 'Your Name' },
  { username: 'yourcashier', password: 'cashierpass', role: 'Cashier', name: 'Cashier Name' }
];
```

## Advanced Customizations

### Add New Payment Methods

**File:** `supemarket` (lines 560-574)

Add more payment options:
```javascript
{[
  { name: 'Cash', icon: Banknote },
  { name: 'Card', icon: CreditCard },
  { name: 'M-Pesa', icon: Smartphone },
  { name: 'PayPal', icon: CreditCard },  // Add new
  { name: 'Bank Transfer', icon: Banknote }  // Add new
].map(({ name, icon: Icon }) => (
  // ... rest of code
))}
```

### Add Product Images

You'll need to:
1. Add an `image` field to products
2. Store image URLs or base64 data
3. Display images in the POS product cards

### Add Discount System

Add fields for:
- Percentage discount
- Fixed amount discount
- Promotional pricing
- Bulk purchase discounts

### Add Tax Calculation

Modify the sale completion to include tax:
```javascript
const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
const tax = subtotal * 0.16; // 16% VAT
const total = subtotal + tax;
```

### Add Expense Tracking

Create new state and views for:
- Daily expenses
- Utility bills
- Salaries
- Rent
- Other operational costs

## Next-Level Features to Add

### 1. Data Persistence (Most Important!)
- Connect to Firebase/Supabase (easiest)
- Or build a Node.js/Express backend with MongoDB
- Or use localStorage for simple browser-based storage

### 2. User Management
- Add more users
- Password change functionality
- User activity logs

### 3. Advanced Inventory
- Product variants (sizes, colors)
- Batch/lot tracking
- Expiry date management
- Supplier purchase orders

### 4. Enhanced Reporting
- Date range filters
- Sales by category
- Sales by payment method
- Profit margin analysis
- Best-selling products
- Hourly sales patterns

### 5. Customer Features
- Customer purchase history
- Loyalty rewards redemption
- Customer birthday specials
- SMS/Email notifications

### 6. Hardware Integration
- USB barcode scanner
- Receipt printer (thermal printer)
- Cash drawer
- Card payment terminal

### 7. Multi-location Support
- Multiple store branches
- Inventory transfer between stores
- Consolidated reporting

### 8. Mobile App Version
- Convert to React Native
- Or use PWA (Progressive Web App)

## Testing Checklist

After customization, test:
- [ ] Login works with new credentials
- [ ] All products display correctly
- [ ] Cart functionality works
- [ ] Sales complete successfully
- [ ] Receipts show correct information
- [ ] Reports are accurate
- [ ] Role permissions work (admin vs cashier)
- [ ] Low stock alerts trigger properly
- [ ] Customer loyalty points calculate correctly
- [ ] CSV export works

## Need Help?

Common issues after customization:
1. **Syntax errors:** Check browser console (F12)
2. **Products not showing:** Check the products array format
3. **Login fails:** Verify username/password in users array
4. **Styling broken:** Check Tailwind CSS classes are correct

## Backup Before Customizing!

Always make a copy of `supemarket` before making changes:
```bash
copy supemarket supemarket.backup
```

Then you can restore if something goes wrong.

