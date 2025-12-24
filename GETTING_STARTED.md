# Getting Started Guide

## Quick Start (Easiest Method)

### Option 1: Run with Node.js (Recommended)

1. Open Command Prompt or Terminal
2. Navigate to the project folder:
   ```bash
   cd "C:\Users\mayieka 43\OneDrive\Desktop\supermarket system"
   ```

3. Install dependencies (first time only):
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser to: `http://localhost:3000`

### Option 2: Using Python (No Installation Required)

1. Open Command Prompt
2. Navigate to the project folder:
   ```bash
   cd "C:\Users\mayieka 43\OneDrive\Desktop\supermarket system"
   ```

3. Start a simple server:
   ```bash
   # For Python 3:
   python -m http.server 8000
   ```

4. Open your browser to: `http://localhost:8000/index.html`

### Option 3: Double-Click (May Have Limitations)

Simply double-click `index.html` to open it in your default browser.

**Note:** Some browsers block local file access for security reasons. If this doesn't work, use Option 1 or 2.

---

## Login Credentials

### Admin Account (Full Access)
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** All features including product management, suppliers, and reports

### Cashier Account (Limited Access)
- **Username:** `cashier`
- **Password:** `cashier123`
- **Access:** POS, Dashboard, and Customer management only

---

## Features Available

### 1. **Dashboard** (Both Admin & Cashier)
- View today's revenue and profit
- Monitor inventory value
- Low stock alerts
- Recent sales history

### 2. **Point of Sale (POS)** (Both Admin & Cashier)
- Search products
- Scan barcodes
- Add items to cart
- Select customer for loyalty points
- Choose payment method (Cash, Card, M-Pesa)
- Complete sales and print receipts

### 3. **Products Management** (Admin Only)
- Add new products
- Edit existing products
- Delete products
- View stock levels
- Set reorder levels

### 4. **Customer Management** (Both Admin & Cashier)
- Add new customers
- Edit customer information
- View loyalty points
- Track purchase history

### 5. **Suppliers** (Admin Only)
- View supplier information
- Contact details

### 6. **Reports** (Admin Only)
- Complete sales history
- Revenue and profit analysis
- Export reports to CSV

---

## Quick Tutorial

### Making Your First Sale:

1. **Login** as admin or cashier
2. Click **"Point of Sale"** in the navigation menu
3. **Search** for products or scan barcode
4. **Click** on a product to add it to the cart
5. **Adjust quantities** using + and - buttons
6. **Select customer** (optional) for loyalty points
7. **Choose payment method**
8. Click **"Complete Sale"**
9. **Print receipt** or close the modal

### Adding a New Product (Admin Only):

1. **Login** as admin
2. Click **"Products"** in the navigation menu
3. Click **"Add Product"** button
4. Fill in all product details:
   - Product name
   - Barcode
   - Category
   - Supplier
   - Cost price
   - Selling price
   - Stock quantity
   - Reorder level
5. Click **"Save Product"**

### Adding a New Customer:

1. Click **"Customers"** in the navigation menu
2. Click **"Add Customer"** button
3. Fill in customer details:
   - Full name
   - Phone number
   - Email address
4. Click **"Save Customer"**

---

## Tips & Tricks

1. **Barcode Scanning:** Type the barcode number and press Enter
2. **Loyalty Points:** Customers earn 1 point for every KES 10 spent
3. **Low Stock Alerts:** Products with stock ≤ reorder level show warnings
4. **CSV Export:** Click the "Export CSV" button on Dashboard or Reports
5. **Receipt Printing:** Use the print button in the receipt modal

---

## Troubleshooting

### Issue: "Can't load the application"
**Solution:** Use Option 1 or 2 (Node.js or Python server)

### Issue: "Products not showing"
**Solution:** Make sure you're logged in and have the right permissions

### Issue: "Can't add to cart"
**Solution:** Check if the product has stock available

### Issue: "Print doesn't work"
**Solution:** Make sure your browser allows printing and check printer settings

---

## Important Notes

⚠️ **Data Persistence:** Currently, all data resets when you refresh the page. This is a demo version. For production use, you would need to connect to a real database.

⚠️ **Security:** This is a demo with hardcoded credentials. For real use, implement proper authentication with a backend server.

---

## Need Help?

1. Check the main `README.md` for detailed documentation
2. Review the browser console for errors (F12 key)
3. Make sure you're using a modern browser (Chrome, Firefox, Edge)

---

## Next Steps

Once you're comfortable with the system:
1. Customize the product list with your actual inventory
2. Add your real customers
3. Update supplier information
4. Consider adding backend integration for data persistence
5. Implement barcode scanner hardware integration

**Enjoy managing your supermarket! 🛒**

