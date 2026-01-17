# 📦 Item Integration Guide

This guide explains how to integrate items/products into your supermarket POS system using the built-in API endpoints.

## ✅ What's Been Integrated

Your system now has comprehensive item integration capabilities:

- **Full CRUD Operations** - Create, Read, Update, Delete items
- **Bulk Import** - Import multiple items at once from JSON
- **External API Integration** - Sync items from external APIs
- **Barcode Lookup** - Quick search by barcode
- **Category & Search Filtering** - Filter items by category or search term

---

## 🚀 API Endpoints

### Basic Item Operations

#### 1. Get All Items/Products
```http
GET /api/products
```

**Query Parameters:**
- `limit` (optional) - Maximum number of items to return (default: 1000)
- `offset` (optional) - Number of items to skip (default: 0)
- `category` (optional) - Filter by category
- `search` (optional) - Search by name or barcode

**Example:**
```javascript
// Get all products
fetch('/api/products')
  .then(res => res.json())
  .then(data => console.log(data));

// Get products with limit and search
fetch('/api/products?limit=50&search=rice')
  .then(res => res.json())
  .then(data => console.log(data));

// Get products by category
fetch('/api/products?category=Grains')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 2. Get Single Item by ID
```http
GET /api/products/:id
```

**Example:**
```javascript
fetch('/api/products/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 3. Get Item by Barcode
```http
GET /api/products/barcode/:barcode
```

**Example:**
```javascript
fetch('/api/products/barcode/8901234567890')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 4. Create New Item
```http
POST /api/products
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Rice 5kg",
  "barcode": "8901234567890",
  "category": "Grains",
  "costPrice": 450,
  "sellingPrice": 650,
  "stock": 45,
  "reorderLevel": 10,
  "supplier": "Grain Traders Ltd"
}
```

**Example:**
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Rice 5kg",
    barcode: "8901234567890",
    category: "Grains",
    costPrice: 450,
    sellingPrice: 650,
    stock: 45,
    reorderLevel: 10,
    supplier: "Grain Traders Ltd"
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 5. Update Item
```http
PUT /api/products/:id
Content-Type: application/json
```

**Request Body:** (same as create, include only fields to update)

**Example:**
```javascript
fetch('/api/products/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    stock: 50,
    sellingPrice: 680
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 6. Delete Item
```http
DELETE /api/products/:id
```

**Example:**
```javascript
fetch('/api/products/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📥 Bulk Import Items

### Import from JSON Array

```http
POST /api/products/bulk-import
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "name": "Rice 5kg",
      "barcode": "8901234567890",
      "category": "Grains",
      "costPrice": 450,
      "sellingPrice": 650,
      "stock": 45,
      "reorderLevel": 10,
      "supplier": "Grain Traders Ltd"
    },
    {
      "name": "Cooking Oil 2L",
      "barcode": "8901234567891",
      "category": "Oils",
      "costPrice": 280,
      "sellingPrice": 380,
      "stock": 8,
      "reorderLevel": 15,
      "supplier": "Oil Distributors"
    }
  ]
}
```

**Or send array directly:**
```json
[
  {
    "name": "Rice 5kg",
    "barcode": "8901234567890",
    ...
  },
  {
    "name": "Cooking Oil 2L",
    "barcode": "8901234567891",
    ...
  }
]
```

**Response:**
```json
{
  "success": true,
  "imported": 2,
  "updated": 0,
  "total": 2,
  "errors": []
}
```

**Example:**
```javascript
const items = [
  {
    name: "Rice 5kg",
    barcode: "8901234567890",
    category: "Grains",
    costPrice: 450,
    sellingPrice: 650,
    stock: 45,
    reorderLevel: 10,
    supplier: "Grain Traders Ltd"
  },
  {
    name: "Cooking Oil 2L",
    barcode: "8901234567891",
    category: "Oils",
    costPrice: 280,
    sellingPrice: 380,
    stock: 8,
    reorderLevel: 15,
    supplier: "Oil Distributors"
  }
];

fetch('/api/products/bulk-import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items })
})
  .then(res => res.json())
  .then(data => {
    console.log(`Imported: ${data.imported}`);
    console.log(`Updated: ${data.updated}`);
    if (data.errors && data.errors.length > 0) {
      console.error('Errors:', data.errors);
    }
  });
```

**Notes:**
- Items with existing barcodes will be **updated** instead of creating duplicates
- Items without barcodes will always create new records
- All fields except `name` are optional

---

## 🌐 External API Integration

### Import Items from External API

```http
POST /api/products/integrate-external
Content-Type: application/json
```

**Request Body:**
```json
{
  "apiUrl": "https://api.example.com/products",
  "apiKey": "your-api-key-here",
  "headers": {
    "X-Custom-Header": "value"
  },
  "mapping": {
    "name": "productName",
    "barcode": "sku",
    "category": "categoryName",
    "costPrice": "cost",
    "sellingPrice": "price",
    "stock": "quantity",
    "reorderLevel": "minStock",
    "supplier": "vendorName"
  }
}
```

**Example:**
```javascript
fetch('/api/products/integrate-external', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiUrl: 'https://api.supplier.com/products',
    apiKey: 'your-api-key',
    mapping: {
      name: 'productName',
      barcode: 'sku',
      category: 'category',
      costPrice: 'cost',
      sellingPrice: 'price',
      stock: 'quantity'
    }
  })
})
  .then(res => res.json())
  .then(data => {
    console.log(`Imported: ${data.imported}`);
    console.log(`Updated: ${data.updated}`);
    console.log(`Source: ${data.source}`);
  });
```

**Response:**
```json
{
  "success": true,
  "imported": 15,
  "updated": 3,
  "total": 18,
  "source": "external_api",
  "errors": []
}
```

**Mapping Field Names:**
If your external API uses different field names, use the `mapping` object to map them to your system's format:
- `name` → Product name
- `barcode` → Barcode/SKU
- `category` → Category name
- `costPrice` → Cost/wholesale price
- `sellingPrice` → Selling/retail price
- `stock` → Current stock quantity
- `reorderLevel` → Minimum stock level
- `supplier` → Supplier/vendor name

---

## 💡 Usage Examples

### Example 1: Import from CSV (via JSON conversion)

1. Convert your CSV to JSON array:
```javascript
// CSV format:
// name,barcode,category,costPrice,sellingPrice,stock,reorderLevel,supplier
// Rice 5kg,8901234567890,Grains,450,650,45,10,Grain Traders

// Convert to JSON:
const csvData = `name,barcode,category,costPrice,sellingPrice,stock,reorderLevel,supplier
Rice 5kg,8901234567890,Grains,450,650,45,10,Grain Traders
Cooking Oil 2L,8901234567891,Oils,280,380,8,15,Oil Distributors`;

function csvToJson(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });
}

const items = csvToJson(csvData);
// Then use bulk-import endpoint
```

### Example 2: Sync with Supplier API Daily

```javascript
async function syncSupplierProducts() {
  try {
    const response = await fetch('/api/products/integrate-external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiUrl: 'https://api.supplier.com/products',
        apiKey: process.env.SUPPLIER_API_KEY,
        mapping: {
          name: 'productName',
          barcode: 'sku',
          category: 'category',
          costPrice: 'wholesalePrice',
          sellingPrice: 'retailPrice',
          stock: 'availableQuantity'
        }
      })
    });
    
    const result = await response.json();
    console.log(`Sync complete: ${result.imported} imported, ${result.updated} updated`);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Run daily at 2 AM
setInterval(syncSupplierProducts, 24 * 60 * 60 * 1000);
```

### Example 3: Update Stock Levels from Inventory System

```javascript
async function updateStockLevels(stockUpdates) {
  // stockUpdates = [{ barcode: '8901234567890', stock: 50 }, ...]
  
  for (const update of stockUpdates) {
    // First, get the product by barcode
    const productRes = await fetch(`/api/products/barcode/${update.barcode}`);
    
    if (productRes.ok) {
      const product = await productRes.json();
      
      // Update stock
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: update.stock })
      });
    }
  }
}
```

---

## 📋 Field Reference

### Item/Product Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ Yes | Product name |
| `barcode` | String | ❌ No | Product barcode/SKU (unique) |
| `category` | String | ❌ No | Product category |
| `costPrice` | Number | ❌ No | Cost/wholesale price (default: 0) |
| `sellingPrice` | Number | ❌ No | Retail/selling price (default: 0) |
| `stock` | Integer | ❌ No | Current stock quantity (default: 0) |
| `reorderLevel` | Integer | ❌ No | Minimum stock level for reorder (default: 10) |
| `supplier` | String | ❌ No | Supplier/vendor name |

---

## 🔧 Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `404` - Not found
- `500` - Server error

**Error Response Format:**
```json
{
  "error": "Error message here"
}
```

**Example Error Handling:**
```javascript
try {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  
  const product = await response.json();
  console.log('Product created:', product);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 🎯 Best Practices

1. **Use Barcodes**: Always include barcodes when available for easier lookup and duplicate prevention
2. **Bulk Import**: Use bulk import for large datasets instead of individual API calls
3. **Error Handling**: Always check for errors in bulk import responses
4. **Mapping**: Use field mapping when integrating external APIs with different schemas
5. **Validation**: Validate data before sending to API (required fields, data types)
6. **Rate Limiting**: Be mindful of API rate limits when importing large datasets

---

## 📚 Related Documentation

- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)
- [Excel Import Guide](./HOW_TO_IMPORT_EXCEL.md)
- [API Documentation](./DATABASE_README.md)

---

## 🆘 Troubleshooting

### Issue: "Database not initialized"
**Solution:** Make sure the database is initialized before making API calls. The server automatically initializes the database on startup.

### Issue: "Product with this barcode already exists"
**Solution:** Use the update endpoint (PUT) instead of create, or remove the existing product first.

### Issue: Bulk import returns errors
**Check:**
- Required fields (name) are present
- Data types are correct (numbers are numbers, not strings)
- Barcode format is valid
- No duplicate barcodes in the import batch

### Issue: External API integration fails
**Check:**
- API URL is correct and accessible
- API key is valid
- CORS is enabled on external API (if calling from browser)
- Field mapping matches your external API structure

---

Need help? Check the main [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide.
