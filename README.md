# Supermarket Management System

A complete, full-featured supermarket management system built with React and Tailwind CSS.

## 🚀 Features

### Authentication
- **Role-based access control**
  - Admin: Full access to all features
  - Cashier: Access to POS, Dashboard, and Customer management
- Demo credentials:
  - Admin: `admin` / `admin123`
  - Cashier: `cashier` / `cashier123`

### Dashboard
- Real-time sales metrics
- Today's revenue and profit tracking
- Inventory value monitoring
- Low stock alerts
- Recent sales transactions view
- Export sales data to CSV

### Point of Sale (POS)
- Intuitive product search
- Barcode scanning support
- Real-time cart management
- Multiple payment methods:
  - Cash
  - Card
  - M-Pesa
- Customer loyalty program integration
- Automatic inventory updates
- Professional receipt generation with print functionality

### Product Management (Admin Only)
- Add, edit, and delete products
- Track:
  - Product name and barcode
  - Category
  - Cost and selling prices
  - Stock levels
  - Reorder levels
  - Supplier information
- Visual low stock indicators
- Bulk import/export capabilities

### Customer Management
- Customer database
- Loyalty points system (1 point per KES 10 spent)
- Purchase history tracking
- Contact information management
- Add, edit, and delete customers

### Supplier Management (Admin Only)
- Supplier contact database
- Product count tracking
- Email and phone contact details

### Reports & Analytics (Admin Only)
- Complete sales history
- Revenue and profit analysis
- Transaction details
- Cashier performance tracking
- Export comprehensive reports to CSV

## 🎯 Key Highlights

1. **Real-time Inventory Management**: Automatic stock updates after each sale
2. **Loyalty Points**: Customers earn points with every purchase
3. **Low Stock Alerts**: Automatic notifications when products reach reorder levels
4. **Professional Receipts**: Detailed receipts with tax information and loyalty points
5. **Multiple Payment Methods**: Support for cash, card, and mobile payments
6. **Role-based Security**: Different access levels for admin and cashier roles
7. **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📦 Installation & Setup

### Option 1: Quick Start (Recommended)

1. Open `index.html` directly in a modern web browser (Chrome, Firefox, Edge, Safari)
2. That's it! The application will run without any installation.

### Option 2: Using a Local Server

1. Install Node.js if you haven't already
2. Open terminal/command prompt in the project directory
3. Run:
```bash
npm install
npm start
```
4. Open your browser to `a1http://localhost:3000`

### Option 3: Using Python's HTTP Server

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## 🎮 How to Use

### For Cashiers:

1. **Login** with cashier credentials
2. **Go to POS** (Point of Sale)
3. **Search or scan products** to add to cart
4. **Adjust quantities** as needed
5. **Select customer** (optional for loyalty points)
6. **Choose payment method**
7. **Complete sale** and print receipt

### For Admins:

1. **Login** with admin credentials
2. **Dashboard**: Monitor overall performance
3. **Products**: Manage inventory
   - Add new products with the "Add Product" button
   - Edit existing products by clicking the edit icon
   - Delete products (with confirmation)
4. **Customers**: Manage customer database
5. **Suppliers**: View and manage suppliers
6. **Reports**: View detailed analytics and export data

## 💡 Technical Details

### Technologies Used:
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent icons
- **Pure JavaScript**: No build process required

### Browser Compatibility:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## 📊 Data Management

Currently, all data is stored in browser memory (state). When you refresh the page, data resets to default values.

### To persist data, you can:
1. Add localStorage integration
2. Connect to a backend API
3. Use a database like Firebase, MongoDB, or PostgreSQL

## 🔒 Security Notes

**Important**: This is a demo application. For production use:
- Implement proper authentication (JWT, OAuth)
- Use a secure backend API
- Hash passwords
- Add input validation and sanitization
- Implement proper database security
- Use HTTPS
- Add rate limiting
- Implement proper error handling

## 📱 Features by User Role

| Feature | Admin | Cashier |
|---------|-------|---------|
| Dashboard | ✅ | ✅ |
| Point of Sale | ✅ | ✅ |
| Product Management | ✅ | ❌ |
| Customer Management | ✅ | ✅ |
| Supplier Management | ✅ | ❌ |
| Reports & Analytics | ✅ | ❌ |

## 🎨 Customization

You can easily customize:
- Colors in Tailwind classes
- Company name and branding
- Tax PIN number in receipts
- Loyalty points calculation (currently 1 point per 10 KES)
- Low stock threshold levels
- Payment methods

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Support

For issues or questions:
1. Check the code comments
2. Review this README
3. Test with demo credentials
4. Check browser console for errors

## 🎉 Enjoy!

Your supermarket management system is ready to use. Start by logging in with the demo credentials and exploring all the features!

