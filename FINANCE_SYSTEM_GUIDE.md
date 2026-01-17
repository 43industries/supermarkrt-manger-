# 💰 Finance System Guide

This guide explains the comprehensive finance system that has been integrated into your supermarket POS system.

## ✅ What's Been Fixed & Added

The finance system now includes:

- **✅ Expenses Management** - Track all business expenses
- **✅ Purchases Management** - Track supplier purchases and inventory
- **✅ Invoices Management** - Create and manage customer invoices
- **✅ Finance Summary** - Comprehensive financial statistics and reports
- **✅ Database Integration** - All finance data stored in SQLite database
- **✅ RESTful API** - Complete API endpoints for all finance operations

---

## 📊 Database Tables

### Expenses Table
Tracks all business expenses:
- `id` - Unique identifier
- `date` - Expense date
- `category` - Expense category (Rent, Utilities, Salaries, etc.)
- `description` - Expense description
- `amount` - Expense amount
- `paymentMethod` - Payment method (Cash, Card, M-Pesa, etc.)
- `reference` - Reference number/note
- `created_at` - Timestamp

### Purchases Table
Tracks supplier purchases:
- `id` - Unique identifier
- `date` - Purchase date
- `supplier` - Supplier name
- `invoiceNo` - Supplier invoice number
- `total` - Total purchase amount
- `amountPaid` - Amount paid
- `status` - Status (Pending, Received, Paid, etc.)
- `items` - JSON array of purchased items
- `notes` - Additional notes
- `created_at` - Timestamp

### Invoices Table
Tracks customer invoices:
- `id` - Unique identifier
- `invoiceNo` - Unique invoice number
- `date` - Invoice date
- `sale_id` - Related sale ID (optional)
- `customer_name` - Customer name
- `customer_address` - Customer address
- `customer_phone` - Customer phone
- `customer_email` - Customer email
- `customer_taxId` - Customer tax ID
- `subtotal` - Subtotal amount
- `tax` - Tax amount
- `total` - Total amount
- `status` - Status (Pending, Paid, etc.)
- `paymentMethod` - Payment method
- `notes` - Additional notes
- `created_at` - Timestamp

---

## 🚀 API Endpoints

### Expenses Endpoints

#### Get All Expenses
```http
GET /api/expenses
```

**Query Parameters:**
- `limit` (optional) - Maximum number to return (default: 1000)
- `offset` (optional) - Number to skip (default: 0)
- `category` (optional) - Filter by category
- `startDate` (optional) - Start date filter (YYYY-MM-DD)
- `endDate` (optional) - End date filter (YYYY-MM-DD)

**Example:**
```javascript
// Get all expenses
fetch('/api/expenses')
  .then(res => res.json())
  .then(data => console.log(data));

// Get expenses by category and date range
fetch('/api/expenses?category=Rent&startDate=2025-01-01&endDate=2025-01-31')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Get Expense by ID
```http
GET /api/expenses/:id
```

#### Create Expense
```http
POST /api/expenses
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2025-01-15",
  "category": "Rent",
  "description": "Monthly rent payment",
  "amount": 50000,
  "paymentMethod": "Bank Transfer",
  "reference": "REF-001"
}
```

**Required Fields:** `date`, `category`, `amount`

#### Update Expense
```http
PUT /api/expenses/:id
Content-Type: application/json
```

#### Delete Expense
```http
DELETE /api/expenses/:id
```

---

### Purchases Endpoints

#### Get All Purchases
```http
GET /api/purchases
```

**Query Parameters:**
- `limit`, `offset` - Pagination
- `supplier` (optional) - Filter by supplier
- `status` (optional) - Filter by status
- `startDate`, `endDate` (optional) - Date range filter

**Example:**
```javascript
// Get all purchases
fetch('/api/purchases')
  .then(res => res.json())
  .then(data => console.log(data));

// Get pending purchases
fetch('/api/purchases?status=Pending')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Get Purchase by ID
```http
GET /api/purchases/:id
```

#### Create Purchase
```http
POST /api/purchases
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2025-01-15",
  "supplier": "ABC Distributors",
  "invoiceNo": "PO-001",
  "total": 25000,
  "amountPaid": 10000,
  "status": "Pending",
  "items": [
    {
      "name": "Rice 5kg",
      "qty": 50,
      "unitCost": 450
    }
  ],
  "notes": "Payment due in 30 days"
}
```

**Required Fields:** `date`, `supplier`, `total`

**Items Format:** Array of objects with `name`, `qty`, `unitCost`

#### Update Purchase
```http
PUT /api/purchases/:id
Content-Type: application/json
```

#### Delete Purchase
```http
DELETE /api/purchases/:id
```

---

### Invoices Endpoints

#### Get All Invoices
```http
GET /api/invoices
```

**Query Parameters:**
- `limit`, `offset` - Pagination
- `status` (optional) - Filter by status
- `startDate`, `endDate` (optional) - Date range filter

#### Get Invoice by ID
```http
GET /api/invoices/:id
```

#### Get Invoice by Invoice Number
```http
GET /api/invoices/invoiceNo/:invoiceNo
```

#### Create Invoice
```http
POST /api/invoices
Content-Type: application/json
```

**Request Body:**
```json
{
  "invoiceNo": "INV-001",
  "date": "2025-01-15",
  "sale_id": 123,
  "customer_name": "John Doe",
  "customer_address": "123 Main St",
  "customer_phone": "+254712345678",
  "customer_email": "john@example.com",
  "customer_taxId": "TAX-123",
  "subtotal": 1000,
  "tax": 160,
  "total": 1160,
  "status": "Pending",
  "paymentMethod": "Cash",
  "notes": "Thank you for your business"
}
```

**Required Fields:** `invoiceNo`, `date`, `subtotal`, `total`

#### Update Invoice
```http
PUT /api/invoices/:id
Content-Type: application/json
```

#### Delete Invoice
```http
DELETE /api/invoices/:id
```

---

### Finance Summary Endpoint

#### Get Finance Summary
```http
GET /api/finance/summary
```

**Query Parameters:**
- `startDate` (optional) - Start date filter (YYYY-MM-DD)
- `endDate` (optional) - End date filter (YYYY-MM-DD)

**Response:**
```json
{
  "revenue": {
    "total": 500000,
    "profit": 150000,
    "count": 250
  },
  "expenses": {
    "total": 75000,
    "count": 45
  },
  "purchases": {
    "total": 200000,
    "paid": 150000,
    "outstanding": 50000,
    "count": 30
  },
  "invoices": {
    "total": 300000,
    "count": 120
  },
  "netProfit": 75000,
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  }
}
```

**Example:**
```javascript
// Get overall summary
fetch('/api/finance/summary')
  .then(res => res.json())
  .then(data => {
    console.log(`Revenue: ${data.revenue.total}`);
    console.log(`Expenses: ${data.expenses.total}`);
    console.log(`Net Profit: ${data.netProfit}`);
  });

// Get summary for specific period
fetch('/api/finance/summary?startDate=2025-01-01&endDate=2025-01-31')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 💡 Usage Examples

### Example 1: Record Daily Expenses

```javascript
async function recordExpense(expenseData) {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      category: expenseData.category,
      description: expenseData.description,
      amount: expenseData.amount,
      paymentMethod: expenseData.paymentMethod || 'Cash'
    })
  });
  
  return await response.json();
}

// Usage
await recordExpense({
  category: 'Utilities',
  description: 'Electricity bill',
  amount: 15000,
  paymentMethod: 'M-Pesa'
});
```

### Example 2: Create Purchase Order

```javascript
async function createPurchase(purchaseData) {
  const response = await fetch('/api/purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      supplier: purchaseData.supplier,
      invoiceNo: purchaseData.invoiceNo,
      total: purchaseData.total,
      amountPaid: purchaseData.amountPaid || 0,
      status: 'Pending',
      items: purchaseData.items
    })
  });
  
  return await response.json();
}

// Usage
await createPurchase({
  supplier: 'ABC Distributors',
  invoiceNo: 'PO-2025-001',
  total: 50000,
  amountPaid: 20000,
  items: [
    { name: 'Rice 5kg', qty: 100, unitCost: 450 },
    { name: 'Sugar 1kg', qty: 200, unitCost: 95 }
  ]
});
```

### Example 3: Generate Invoice from Sale

```javascript
async function createInvoiceFromSale(saleId, customerInfo) {
  // First, get the sale
  const saleResponse = await fetch(`/api/sales/${saleId}`);
  const sale = await saleResponse.json();
  
  // Generate invoice number
  const invoiceNo = `INV-${Date.now()}`;
  
  // Create invoice
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invoiceNo: invoiceNo,
      date: new Date().toISOString().split('T')[0],
      sale_id: saleId,
      customer_name: customerInfo.name,
      customer_address: customerInfo.address,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      customer_taxId: customerInfo.taxId,
      subtotal: sale.total,
      tax: sale.total * 0.16, // 16% VAT
      total: sale.total * 1.16,
      status: 'Pending',
      paymentMethod: sale.paymentMethod
    })
  });
  
  return await response.json();
}
```

### Example 4: Monthly Finance Report

```javascript
async function getMonthlyReport(year, month) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
  const summaryResponse = await fetch(
    `/api/finance/summary?startDate=${startDate}&endDate=${endDate}`
  );
  const summary = await summaryResponse.json();
  
  // Get detailed expenses
  const expensesResponse = await fetch(
    `/api/expenses?startDate=${startDate}&endDate=${endDate}`
  );
  const expenses = await expensesResponse.json();
  
  // Get detailed purchases
  const purchasesResponse = await fetch(
    `/api/purchases?startDate=${startDate}&endDate=${endDate}`
  );
  const purchases = await purchasesResponse.json();
  
  return {
    summary,
    expenses,
    purchases
  };
}

// Usage
const report = await getMonthlyReport(2025, 1);
console.log('Monthly Report:', report);
```

---

## 📋 Common Expense Categories

Suggested categories for expenses:
- **Rent** - Office/store rent
- **Utilities** - Electricity, water, internet
- **Salaries** - Employee salaries
- **Marketing** - Advertising and promotions
- **Maintenance** - Equipment and facility maintenance
- **Supplies** - Office supplies
- **Insurance** - Business insurance
- **Taxes** - Tax payments
- **Transport** - Delivery and transport costs
- **Other** - Miscellaneous expenses

---

## 🔧 Best Practices

1. **Regular Expense Tracking**: Record expenses daily or weekly for accurate reporting
2. **Purchase Status**: Update purchase status as orders are received and paid
3. **Invoice Numbers**: Use unique, sequential invoice numbers (e.g., INV-001, INV-002)
4. **Date Filtering**: Use date filters when querying for reports
5. **Purchase Items**: Always include detailed items in purchases for inventory tracking
6. **Finance Summary**: Use the summary endpoint for quick financial overviews

---

## 🆘 Troubleshooting

### Issue: "Date, category, and amount are required"
**Solution:** Make sure all required fields are included when creating expenses.

### Issue: "Invoice with this invoice number already exists"
**Solution:** Use a unique invoice number. Consider using timestamp or sequential numbering.

### Issue: Purchase items not displaying correctly
**Solution:** Items are stored as JSON. Make sure to parse them when reading from the database (the API does this automatically).

### Issue: Finance summary not calculating correctly
**Check:**
- Date filters are in correct format (YYYY-MM-DD)
- All transactions have valid amounts
- Database is properly initialized

---

## 📚 Related Documentation

- [Item Integration Guide](./ITEM_INTEGRATION_GUIDE.md)
- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)
- [API Documentation](./DATABASE_README.md)

---

Need help? Check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
