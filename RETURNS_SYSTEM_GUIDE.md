# 🔄 Returns & Refunds System Guide

This guide explains how to handle returnable items, returns, and refunds in your supermarket POS system.

## ✅ What's Been Added

The returns system includes:

- **✅ Returns Management** - Track all product returns
- **✅ Partial Returns** - Return individual items from a sale
- **✅ Full Returns** - Return entire sale
- **✅ Automatic Stock Restoration** - Stock automatically restored when items are returned
- **✅ Return Reasons** - Track why items are returned
- **✅ Refund Processing** - Handle refunds with different payment methods
- **✅ Return Status Tracking** - Track return status (Pending, Processed, Refunded)
- **✅ Database Integration** - All returns stored in SQLite database
- **✅ RESTful API** - Complete API endpoints for returns management

---

## 📊 Database Tables

### Returns Table
Tracks all returns:
- `id` - Unique identifier
- `returnNo` - Unique return number (e.g., RET-001)
- `date` - Return date
- `sale_id` - Original sale ID (required)
- `customer_name` - Customer name
- `customer_phone` - Customer phone
- `reason` - Reason for return (required)
- `refundAmount` - Refund amount (required)
- `refundMethod` - Refund method (Cash, Card, M-Pesa, Store Credit)
- `status` - Status (Pending, Processed, Refunded, Cancelled)
- `processedBy` - Staff member who processed return
- `notes` - Additional notes
- `created_at` - Timestamp

### Return Items Table
Tracks individual returned items:
- `id` - Unique identifier
- `return_id` - Return ID (foreign key)
- `product_id` - Product ID (foreign key)
- `product_name` - Product name
- `quantity` - Quantity returned
- `unit_price` - Original unit price
- `subtotal` - Subtotal for this item
- `reason` - Item-specific return reason
- `restocked` - Whether stock was restored (1 = yes, 0 = no)

---

## 🚀 API Endpoints

### Get All Returns
```http
GET /api/returns
```

**Query Parameters:**
- `limit` (optional) - Maximum number to return (default: 1000)
- `offset` (optional) - Number to skip (default: 0)
- `status` (optional) - Filter by status
- `sale_id` (optional) - Filter by sale ID
- `startDate` (optional) - Start date filter (YYYY-MM-DD)
- `endDate` (optional) - End date filter (YYYY-MM-DD)

**Example:**
```javascript
// Get all returns
fetch('/api/returns')
  .then(res => res.json())
  .then(data => console.log(data));

// Get pending returns
fetch('/api/returns?status=Pending')
  .then(res => res.json())
  .then(data => console.log(data));

// Get returns for a specific sale
fetch('/api/returns?sale_id=123')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Return by ID
```http
GET /api/returns/:id
```

### Get Return by Return Number
```http
GET /api/returns/returnNo/:returnNo
```

### Get Returns for a Sale
```http
GET /api/sales/:saleId/returns
```

**Example:**
```javascript
// Get all returns for sale #123
fetch('/api/sales/123/returns')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Create Return
```http
POST /api/returns
Content-Type: application/json
```

**Request Body:**
```json
{
  "returnNo": "RET-001",
  "date": "2025-01-15",
  "sale_id": 123,
  "customer_name": "John Doe",
  "customer_phone": "+254712345678",
  "reason": "Defective product",
  "refundAmount": 650,
  "refundMethod": "Cash",
  "status": "Processed",
  "processedBy": "Store Manager",
  "notes": "Product was damaged",
  "items": [
    {
      "product_id": 1,
      "product_name": "Rice 5kg",
      "quantity": 1,
      "unit_price": 650,
      "subtotal": 650,
      "reason": "Damaged packaging",
      "restock": true
    }
  ]
}
```

**Required Fields:**
- `returnNo` - Unique return number
- `date` - Return date
- `sale_id` - Original sale ID
- `reason` - Return reason
- `refundAmount` - Total refund amount
- `items` - Array of returned items (at least one)

**Item Fields:**
- `product_id` - Product ID (optional, for stock restoration)
- `product_name` - Product name (required)
- `quantity` - Quantity returned (required)
- `unit_price` - Original unit price (required)
- `subtotal` - Subtotal for this item (required)
- `reason` - Item-specific reason (optional)
- `restock` - Whether to restore stock (default: true)

**Example:**
```javascript
async function createReturn(returnData) {
  const response = await fetch('/api/returns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sale_id: returnData.saleId,
      customer_name: returnData.customerName,
      customer_phone: returnData.customerPhone,
      reason: returnData.reason,
      refundAmount: returnData.refundAmount,
      refundMethod: returnData.refundMethod || 'Cash',
      status: 'Processed',
      processedBy: 'Store Manager',
      items: returnData.items.map(item => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
        reason: item.reason,
        restock: item.restock !== false // Default to true
      }))
    })
  });
  
  return await response.json();
}

// Usage
const returnRecord = await createReturn({
  saleId: 123,
  customerName: 'John Doe',
  customerPhone: '+254712345678',
  reason: 'Defective product',
  refundAmount: 650,
  refundMethod: 'Cash',
  items: [
    {
      productId: 1,
      productName: 'Rice 5kg',
      quantity: 1,
      unitPrice: 650,
      subtotal: 650,
      reason: 'Damaged packaging',
      restock: true
    }
  ]
});
```

**Important Notes:**
- Stock is **automatically restored** when `restock: true` (default)
- The return is processed in a **transaction** - if any part fails, the entire return is rolled back
- Stock restoration happens automatically for items with `product_id` and `restock: true`

### Update Return
```http
PUT /api/returns/:id
Content-Type: application/json
```

**Example:**
```javascript
// Update return status
fetch('/api/returns/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'Refunded',
    refundMethod: 'M-Pesa'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Delete Return
```http
DELETE /api/returns/:id
```

**Important:** Deleting a return will:
- Reverse stock restoration (reduce stock by returned quantities)
- Only if items were restocked (`restocked = 1`)
- Delete all return items
- Delete the return record

**Example:**
```javascript
// Delete return (will reverse stock)
fetch('/api/returns/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 💡 Common Return Scenarios

### Scenario 1: Full Return (All Items)

```javascript
async function returnFullSale(saleId) {
  // First, get the sale details
  const saleResponse = await fetch(`/api/sales/${saleId}`);
  const sale = await saleResponse.json();
  
  // Get sale items
  const saleItemsResponse = await fetch(`/api/sales/${saleId}/items`);
  const saleItems = await saleItemsResponse.json();
  
  // Calculate total refund
  const refundAmount = sale.total;
  
  // Create return with all items
  const returnResponse = await fetch('/api/returns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sale_id: saleId,
      customer_name: sale.customer,
      reason: 'Customer request',
      refundAmount: refundAmount,
      refundMethod: sale.paymentMethod,
      status: 'Processed',
      items: saleItems.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        restock: true
      }))
    })
  });
  
  return await returnResponse.json();
}
```

### Scenario 2: Partial Return (Some Items)

```javascript
async function returnPartialItems(saleId, itemsToReturn) {
  // itemsToReturn = [{ product_id: 1, quantity: 1, reason: 'Defective' }, ...]
  
  // Get sale items to find original prices
  const saleItemsResponse = await fetch(`/api/sales/${saleId}/items`);
  const saleItems = await saleItemsResponse.json();
  
  // Build return items array
  const returnItems = itemsToReturn.map(item => {
    const saleItem = saleItems.find(si => si.product_id === item.product_id);
    return {
      product_id: item.product_id,
      product_name: saleItem.product_name,
      quantity: item.quantity,
      unit_price: saleItem.unit_price,
      subtotal: saleItem.unit_price * item.quantity,
      reason: item.reason,
      restock: true
    };
  });
  
  // Calculate total refund
  const refundAmount = returnItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Create return
  const returnResponse = await fetch('/api/returns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sale_id: saleId,
      reason: 'Partial return - defective items',
      refundAmount: refundAmount,
      refundMethod: 'Cash',
      status: 'Processed',
      items: returnItems
    })
  });
  
  return await returnResponse.json();
}
```

### Scenario 3: Return Without Restocking (Damaged/Expired)

```javascript
async function returnDamagedItem(saleId, productId, quantity) {
  // Get sale item details
  const saleItemsResponse = await fetch(`/api/sales/${saleId}/items`);
  const saleItems = await saleItemsResponse.json();
  const saleItem = saleItems.find(si => si.product_id === productId);
  
  // Create return without restocking
  const returnResponse = await fetch('/api/returns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sale_id: saleId,
      reason: 'Damaged/Expired - cannot restock',
      refundAmount: saleItem.unit_price * quantity,
      refundMethod: 'Cash',
      status: 'Processed',
      items: [{
        product_id: productId,
        product_name: saleItem.product_name,
        quantity: quantity,
        unit_price: saleItem.unit_price,
        subtotal: saleItem.unit_price * quantity,
        reason: 'Item damaged beyond resale',
        restock: false // Don't restore stock
      }]
    })
  });
  
  return await returnResponse.json();
}
```

### Scenario 4: Exchange (Return + New Sale)

```javascript
async function exchangeItem(saleId, returnItem, newItem) {
  // Step 1: Process return
  const returnResponse = await fetch('/api/returns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      returnNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sale_id: saleId,
      reason: 'Exchange',
      refundAmount: returnItem.subtotal,
      refundMethod: 'Store Credit',
      status: 'Processed',
      items: [returnItem]
    })
  });
  
  const returnRecord = await returnResponse.json();
  
  // Step 2: Create new sale (if needed)
  // This would use your existing sale creation logic
  // The refund amount can be applied as credit/discount
  
  return returnRecord;
}
```

---

## 📋 Common Return Reasons

Suggested return reasons:
- **Defective** - Product is defective or damaged
- **Wrong Item** - Customer received wrong item
- **Not as Described** - Product doesn't match description
- **Expired** - Product is expired
- **Customer Request** - Customer changed mind
- **Exchange** - Customer wants to exchange
- **Damaged Packaging** - Packaging is damaged
- **Quality Issue** - Product quality is poor
- **Size/Color Wrong** - Wrong size or color
- **Duplicate Order** - Customer ordered by mistake

---

## 🔧 Return Status Workflow

1. **Pending** - Return created but not yet processed
2. **Processed** - Return processed, stock restored
3. **Refunded** - Refund has been issued to customer
4. **Cancelled** - Return was cancelled

**Typical Flow:**
```
Pending → Processed → Refunded
```

---

## 💰 Refund Methods

Supported refund methods:
- **Cash** - Cash refund
- **Card** - Refund to original card
- **M-Pesa** - M-Pesa refund
- **Store Credit** - Credit to customer account
- **Bank Transfer** - Bank transfer refund

---

## 📊 Finance Summary Integration

Returns are automatically included in the finance summary:

```javascript
// Get finance summary (includes returns)
fetch('/api/finance/summary?startDate=2025-01-01&endDate=2025-01-31')
  .then(res => res.json())
  .then(data => {
    console.log(`Revenue: ${data.revenue.total}`);
    console.log(`Returns: ${data.returns.total}`);
    console.log(`Net Revenue: ${data.netRevenue}`); // Revenue - Returns
    console.log(`Net Profit: ${data.netProfit}`); // Profit - Expenses - Returns
  });
```

---

## 🎯 Best Practices

1. **Always Link to Original Sale**: Always provide `sale_id` to track which sale the return is from
2. **Use Unique Return Numbers**: Generate unique return numbers (e.g., RET-001, RET-002)
3. **Record Return Reasons**: Always record why items are returned for analytics
4. **Restock Decision**: Decide whether to restock based on item condition
5. **Refund Method**: Match refund method to original payment when possible
6. **Process Quickly**: Process returns promptly to maintain customer satisfaction
7. **Track Status**: Update return status as it moves through the process

---

## 🆘 Troubleshooting

### Issue: "At least one item must be returned"
**Solution:** Make sure the `items` array has at least one item.

### Issue: "Return with this return number already exists"
**Solution:** Use a unique return number. Consider using timestamp or sequential numbering.

### Issue: Stock not restoring
**Check:**
- `product_id` is provided for items
- `restock: true` is set (or omitted, as it defaults to true)
- Product exists in database

### Issue: Return deletion not reversing stock
**Check:**
- Items were originally restocked (`restocked = 1`)
- Product IDs are valid
- Database transaction completed successfully

---

## 📚 Related Documentation

- [Finance System Guide](./FINANCE_SYSTEM_GUIDE.md)
- [Item Integration Guide](./ITEM_INTEGRATION_GUIDE.md)
- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)

---

Need help? Check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
