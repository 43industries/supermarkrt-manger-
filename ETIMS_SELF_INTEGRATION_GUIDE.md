# 🔧 ETIMS API Self-Integration Guide

## 📋 Overview

This guide helps you integrate ETIMS (Electronic Tax Invoice Management System) API into your SureMartRess system **by yourself**.

---

## 🎯 Prerequisites

Before starting, you need:

1. **✅ KRA PIN** (Personal Identification Number)
2. **✅ ETIMS Portal Account** (register at https://etims.kra.go.ke)
3. **✅ ETIMS API Credentials** from KRA:
   - Consumer Key
   - Consumer Secret
   - Access Token URL
   - API Base URL
4. **✅ ETIMS API Documentation** from KRA
5. **✅ Basic understanding of REST APIs** (HTTP requests, JSON)

---

## 📚 Step 1: Get ETIMS API Credentials

### Register with KRA ETIMS:

1. **Visit KRA ETIMS Portal:**
   - URL: https://etims.kra.go.ke
   - Sign up with your KRA PIN
   - Complete registration process

2. **Request API Access:**
   - Login to ETIMS portal
   - Go to "Service Request" section
   - Select "API Integration" or "OSCU" (Online Sales Control Unit)
   - Submit application with required documents

3. **Get API Credentials:**
   - KRA will provide:
     - Consumer Key
     - Consumer Secret
     - Access Token URL
     - API Base URL
   - Save these securely

4. **Download API Documentation:**
   - Get ETIMS API documentation from KRA
   - Review API endpoints and data format requirements

---

## 🔑 Step 2: Understand ETIMS API Flow

### Typical ETIMS API Flow:

```
1. Get Access Token (OAuth 2.0)
   ↓
2. Prepare Invoice Data (ETIMS format)
   ↓
3. Submit Invoice to ETIMS API
   ↓
4. Receive Invoice Number (from KRA)
   ↓
5. Store Invoice Number (in your database)
```

---

## 📦 Step 3: Install Required Packages

### Add to `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "crypto": "^1.0.1"
  }
}
```

**Then run:**
```bash
npm install axios crypto
```

---

## 🔐 Step 4: Create ETIMS Authentication Module

### Create `etims-auth.js`:

```javascript
const axios = require('axios');
const crypto = require('crypto');

// ETIMS API Configuration (from KRA)
const ETIMS_CONFIG = {
  consumerKey: 'YOUR_CONSUMER_KEY', // From KRA
  consumerSecret: 'YOUR_CONSUMER_SECRET', // From KRA
  accessTokenURL: 'https://etims-api.kra.go.ke/oauth/token', // From KRA documentation
  apiBaseURL: 'https://etims-api.kra.go.ke/api', // From KRA documentation
  environment: 'sandbox' // or 'production'
};

// Get Access Token
async function getAccessToken() {
  try {
    // Generate signature (method depends on KRA requirements)
    const timestamp = new Date().toISOString();
    const signature = generateSignature(timestamp);
    
    const response = await axios.post(ETIMS_CONFIG.accessTokenURL, {
      grant_type: 'client_credentials',
      consumer_key: ETIMS_CONFIG.consumerKey,
      consumer_secret: ETIMS_CONFIG.consumerSecret,
      timestamp: timestamp,
      signature: signature
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('ETIMS Auth Error:', error.response?.data || error.message);
    throw error;
  }
}

// Generate signature (check KRA documentation for exact method)
function generateSignature(timestamp) {
  // KRA may require specific signature generation
  // Check ETIMS API documentation for exact method
  const message = `${ETIMS_CONFIG.consumerKey}${timestamp}${ETIMS_CONFIG.consumerSecret}`;
  return crypto.createHash('sha256').update(message).digest('hex');
}

module.exports = {
  getAccessToken,
  ETIMS_CONFIG
};
```

**⚠️ Important:** Replace placeholders with actual values from KRA and follow KRA's exact signature/authentication method.

---

## 📄 Step 5: Create ETIMS Invoice Format Module

### Create `etims-invoice-format.js`:

```javascript
// Convert your invoice to ETIMS format
function formatInvoiceForETIMS(invoice, storeConfig) {
  // Get current invoice data from database
  // Format according to ETIMS requirements (check KRA documentation)
  
  return {
    // Required fields (example - check KRA documentation for exact format)
    invoiceNo: invoice.invoiceNo,
    date: invoice.date,
    time: invoice.time || new Date().toTimeString().split(' ')[0],
    
    // Store information
    seller: {
      pin: storeConfig.taxPin, // Your KRA PIN
      name: storeConfig.storeName,
      address: storeConfig.address,
      phone: storeConfig.phone,
      email: storeConfig.email
    },
    
    // Customer information
    buyer: {
      pin: invoice.customer_taxId || null,
      name: invoice.customer_name || 'Walk-in Customer',
      address: invoice.customer_address || null,
      phone: invoice.customer_phone || null,
      email: invoice.customer_email || null
    },
    
    // Invoice items
    items: invoice.items.map(item => ({
      itemCode: item.product_id || item.id,
      itemName: item.product_name || item.name,
      quantity: item.quantity,
      unitPrice: item.unit_price || item.sellingPrice,
      total: item.subtotal || (item.quantity * (item.unit_price || item.sellingPrice)),
      taxRate: 0.16, // 16% VAT (check if this is correct for your products)
      taxAmount: (item.subtotal || (item.quantity * (item.unit_price || item.sellingPrice))) * 0.16
    })),
    
    // Totals
    subtotal: invoice.subtotal,
    tax: invoice.tax || (invoice.subtotal * 0.16),
    total: invoice.total,
    
    // Payment information
    paymentMethod: invoice.paymentMethod || 'Cash',
    
    // Additional fields (check KRA documentation)
    currency: 'KES',
    exchangeRate: 1
  };
}

module.exports = {
  formatInvoiceForETIMS
};
```

**⚠️ Important:** The exact format depends on KRA's ETIMS API documentation. Use this as a template and adjust according to KRA requirements.

---

## 🚀 Step 6: Create ETIMS API Integration Module

### Create `etims-api.js`:

```javascript
const axios = require('axios');
const { getAccessToken, ETIMS_CONFIG } = require('./etims-auth');
const { formatInvoiceForETIMS } = require('./etims-invoice-format');

// Submit invoice to ETIMS
async function submitInvoiceToETIMS(invoice, storeConfig) {
  try {
    // Step 1: Get access token
    const accessToken = await getAccessToken();
    
    // Step 2: Format invoice for ETIMS
    const etimsInvoice = formatInvoiceForETIMS(invoice, storeConfig);
    
    // Step 3: Submit to ETIMS API
    const response = await axios.post(
      `${ETIMS_CONFIG.apiBaseURL}/invoices`,
      etimsInvoice,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Step 4: Return ETIMS invoice number
    return {
      success: true,
      etimsInvoiceNo: response.data.invoiceNo, // KRA's invoice number
      kraReceipt: response.data.receiptNo, // KRA receipt number
      data: response.data
    };
  } catch (error) {
    console.error('ETIMS Submission Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

// Validate invoice before submission
async function validateInvoice(invoice) {
  // Add validation logic (check KRA requirements)
  const errors = [];
  
  if (!invoice.date) errors.push('Date is required');
  if (!invoice.subtotal) errors.push('Subtotal is required');
  if (!invoice.items || invoice.items.length === 0) errors.push('Items are required');
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  submitInvoiceToETIMS,
  validateInvoice
};
```

---

## 🔧 Step 7: Integrate into Server

### Update `server.js`:

Add at the top:
```javascript
const { submitInvoiceToETIMS, validateInvoice } = require('./etims-api');
```

Update the invoice creation endpoint (`POST /api/invoices`):

```javascript
app.post('/api/invoices', async (req, res) => {
    const db = getDatabase();
    const { invoiceNo, date, sale_id, customer_name, customer_address, customer_phone, customer_email, customer_taxId, subtotal, tax, total, status, paymentMethod, notes, items } = req.body;

    if (!invoiceNo || !date || !subtotal || !total) {
        return res.status(400).json({ error: 'Invoice number, date, subtotal, and total are required' });
    }

    // Validate invoice
    const validation = await validateInvoice(req.body);
    if (!validation.valid) {
        return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    const sql = `INSERT INTO invoices (invoiceNo, date, sale_id, customer_name, customer_address, customer_phone, customer_email, customer_taxId, subtotal, tax, total, status, paymentMethod, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [invoiceNo, date, sale_id || null, customer_name || null, customer_address || null, customer_phone || null, customer_email || null, customer_taxId || null, subtotal, tax || 0, total, status || 'Pending', paymentMethod || null, notes || null], async function(err) {
        if (err) {
            console.error('Error creating invoice:', err);
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Invoice with this invoice number already exists' });
            }
            return res.status(500).json({ error: 'Failed to create invoice' });
        }

        const invoiceId = this.lastID;
        
        // Get store config (from settings or database)
        const storeConfig = {
            taxPin: 'P051234567X', // Get from database/settings
            storeName: '43 INDUSTRIES SUPERMARKET MANAGER',
            address: 'Nairobi, Kenya',
            phone: '+254 XXX XXX XXX',
            email: 'info@43industries.com'
        };
        
        // Prepare invoice object with items
        const invoiceData = {
            id: invoiceId,
            invoiceNo: invoiceNo,
            date: date,
            customer_name: customer_name,
            customer_address: customer_address,
            customer_phone: customer_phone,
            customer_email: customer_email,
            customer_taxId: customer_taxId,
            subtotal: subtotal,
            tax: tax,
            total: total,
            paymentMethod: paymentMethod,
            items: items || [] // Include items
        };
        
        // Submit to ETIMS (optional - can be done async)
        try {
            const etimsResult = await submitInvoiceToETIMS(invoiceData, storeConfig);
            
            if (etimsResult.success) {
                // Update invoice with ETIMS invoice number
                db.run('UPDATE invoices SET notes = ? WHERE id = ?', 
                    [`ETIMS Invoice: ${etimsResult.etimsInvoiceNo}`, invoiceId], 
                    (err) => {
                        if (err) console.error('Error updating ETIMS invoice number:', err);
                    }
                );
            } else {
                console.error('ETIMS submission failed:', etimsResult.error);
                // Optionally store error in database
            }
        } catch (error) {
            console.error('ETIMS submission error:', error);
            // Continue even if ETIMS submission fails
        }
        
        // Fetch and return invoice
        db.get('SELECT * FROM invoices WHERE id = ?', [invoiceId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Invoice created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});
```

---

## 🧪 Step 8: Testing

### Test in Sandbox First:

1. **Use KRA Sandbox Environment:**
   - Use sandbox credentials from KRA
   - Test invoice submission
   - Verify responses

2. **Test Flow:**
   ```javascript
   // Test script: test-etims.js
   const { submitInvoiceToETIMS } = require('./etims-api');
   
   const testInvoice = {
     invoiceNo: 'INV-00001',
     date: '2026-01-11',
     customer_name: 'Test Customer',
     customer_taxId: 'P051234567X',
     subtotal: 1000,
     tax: 160,
     total: 1160,
     items: [
       {
         product_name: 'Test Product',
         quantity: 1,
         unit_price: 1000,
         subtotal: 1000
       }
     ]
   };
   
   submitInvoiceToETIMS(testInvoice, storeConfig)
     .then(result => {
       console.log('Result:', result);
     })
     .catch(error => {
       console.error('Error:', error);
     });
   ```

3. **Run Test:**
   ```bash
   node test-etims.js
   ```

---

## 📝 Step 9: Error Handling

### Add Error Handling:

```javascript
// In etims-api.js
async function submitInvoiceToETIMS(invoice, storeConfig) {
  try {
    const accessToken = await getAccessToken();
    const etimsInvoice = formatInvoiceForETIMS(invoice, storeConfig);
    const response = await axios.post(/* ... */);
    
    return { success: true, data: response.data };
  } catch (error) {
    // Handle specific errors
    if (error.response?.status === 401) {
      return { success: false, error: 'Authentication failed. Check credentials.' };
    }
    if (error.response?.status === 400) {
      return { success: false, error: 'Invalid invoice data', details: error.response.data };
    }
    if (error.response?.status === 500) {
      return { success: false, error: 'KRA server error. Try again later.' };
    }
    
    return { success: false, error: error.message };
  }
}
```

---

## 🔄 Step 10: Queue System (Recommended)

For production, consider a queue system to handle ETIMS submissions:

```javascript
// Simple queue system (or use Redis/Bull for production)
const etimsQueue = [];

async function queueETIMSSubmission(invoiceId, invoiceData, storeConfig) {
  etimsQueue.push({ invoiceId, invoiceData, storeConfig });
  processETIMSQueue();
}

async function processETIMSQueue() {
  if (etimsQueue.length === 0) return;
  
  const { invoiceId, invoiceData, storeConfig } = etimsQueue.shift();
  
  try {
    const result = await submitInvoiceToETIMS(invoiceData, storeConfig);
    // Update database with result
  } catch (error) {
    // Retry or log error
    console.error('ETIMS submission failed for invoice:', invoiceId);
  }
  
  // Process next item
  setTimeout(processETIMSQueue, 1000);
}
```

---

## 📚 Resources

### KRA ETIMS Resources:

1. **ETIMS Portal:** https://etims.kra.go.ke
2. **KRA Website:** https://www.kra.go.ke
3. **ETIMS API Documentation:** (Get from KRA)
4. **Support:** Contact KRA directly

### Key Things to Check in KRA Documentation:

- ✅ Exact API endpoint URLs
- ✅ Authentication method (OAuth 2.0 flow)
- ✅ Request/response format
- ✅ Required fields
- ✅ Error codes and handling
- ✅ Rate limits
- ✅ Sandbox vs Production URLs

---

## ⚠️ Important Notes

1. **Follow KRA Documentation Exactly:**
   - ETIMS API format is specific
   - Use exact field names and formats from KRA docs

2. **Test in Sandbox First:**
   - Always test in KRA sandbox before production
   - Verify all fields are correct

3. **Handle Errors Gracefully:**
   - ETIMS submission may fail (network, KRA server, etc.)
   - Store invoices locally even if ETIMS fails
   - Retry failed submissions

4. **Security:**
   - Store API credentials securely (environment variables)
   - Never commit credentials to code repository

5. **Compliance:**
   - Ensure invoices meet KRA requirements
   - Keep records of all submissions
   - Handle tax calculations correctly

---

## 🎯 Summary

**Steps to Self-Integrate ETIMS:**

1. ✅ Get ETIMS API credentials from KRA
2. ✅ Install required packages (axios, crypto)
3. ✅ Create authentication module
4. ✅ Create invoice format module
5. ✅ Create API integration module
6. ✅ Integrate into server.js
7. ✅ Test in sandbox
8. ✅ Add error handling
9. ✅ Deploy to production

**Time Estimate:** 1-2 weeks (depending on KRA documentation clarity and testing)

**Complexity:** Medium-High (requires understanding of REST APIs and OAuth 2.0)

---

## 🆘 Need Help?

If you get stuck:
1. Check KRA ETIMS API documentation
2. Contact KRA support for API questions
3. Review error messages carefully
4. Test with sandbox environment first

**Good luck with your ETIMS integration!** 🚀
