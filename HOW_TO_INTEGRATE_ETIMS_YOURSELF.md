# 🔧 How to Integrate ETIMS API Yourself

## 📋 Quick Overview

This guide shows you **step-by-step** how to integrate KRA ETIMS API into your SureMartRess system **without needing a developer**.

---

## ✅ Prerequisites Checklist

Before you start:

- [ ] KRA PIN (Personal Identification Number)
- [ ] Registered business with KRA
- [ ] ETIMS Portal account (https://etims.kra.go.ke)
- [ ] ETIMS API credentials from KRA (Consumer Key, Consumer Secret)
- [ ] ETIMS API documentation from KRA
- [ ] Basic understanding of:
  - How to edit code files
  - How to run terminal commands
  - What APIs are (REST APIs, HTTP requests)

---

## 🎯 Step-by-Step Process

### Step 1: Get ETIMS API Credentials from KRA

1. **Register on ETIMS Portal:**
   - Go to: https://etims.kra.go.ke
   - Sign up with your KRA PIN
   - Complete registration

2. **Request API Access:**
   - Login to ETIMS portal
   - Go to "Service Request"
   - Select "API Integration" or "OSCU" (Online Sales Control Unit)
   - Submit application

3. **Get Credentials:**
   - KRA will provide:
     - Consumer Key
     - Consumer Secret
     - Access Token URL
     - API Base URL
   - **Save these securely!**

4. **Download Documentation:**
   - Get ETIMS API documentation
   - Read it carefully (this is your reference)

---

### Step 2: Install Required Packages

Open terminal in your project folder and run:

```bash
npm install axios
```

This installs the `axios` package for making HTTP requests to KRA API.

---

### Step 3: Create ETIMS Integration File

Create a new file called `etims-api.js` in your project root.

**Copy the template code from `ETIMS_INTEGRATION_TEMPLATE.js`** (included in this project).

---

### Step 4: Configure ETIMS Credentials

Edit `etims-api.js` and replace:

```javascript
consumerKey: 'YOUR_CONSUMER_KEY_FROM_KRA',
consumerSecret: 'YOUR_CONSUMER_SECRET_FROM_KRA',
accessTokenURL: 'https://etims-api.kra.go.ke/oauth/token', // Check KRA docs
apiBaseURL: 'https://etims-api.kra.go.ke/api', // Check KRA docs
```

**With your actual values from KRA.**

⚠️ **Important:** Check KRA documentation for exact API URLs!

---

### Step 5: Adjust Invoice Format

In `etims-api.js`, find the `formatInvoiceForETIMS` function.

**Check KRA ETIMS API documentation** and adjust the format to match KRA's exact requirements:

- Field names
- Data types
- Required fields
- Optional fields

This is critical - the format must match KRA's requirements exactly!

---

### Step 6: Integrate into Your Server

Edit `server.js` and add at the top:

```javascript
const { submitInvoiceToETIMS, validateInvoice } = require('./etims-api');
```

Find the invoice creation endpoint (`POST /api/invoices`) and add ETIMS submission:

```javascript
// After creating invoice in database:
const etimsResult = await submitInvoiceToETIMS(invoiceData, storeConfig);

if (etimsResult.success) {
  console.log('ETIMS submission successful:', etimsResult.etimsInvoiceNo);
  // Optionally save ETIMS invoice number to database
} else {
  console.error('ETIMS submission failed:', etimsResult.error);
  // Handle error (log, retry, etc.)
}
```

See `ETIMS_SELF_INTEGRATION_GUIDE.md` for detailed code examples.

---

### Step 7: Test in Sandbox

**ALWAYS test in KRA sandbox first!**

1. Use sandbox credentials (from KRA)
2. Create a test invoice
3. Submit to ETIMS sandbox
4. Verify response

**Test script example:**
```javascript
// test-etims.js
const { submitInvoiceToETIMS } = require('./etims-api');

const testInvoice = {
  invoiceNo: 'TEST-001',
  date: '2026-01-11',
  customer_name: 'Test Customer',
  subtotal: 1000,
  tax: 160,
  total: 1160,
  items: [
    { product_name: 'Test Product', quantity: 1, unit_price: 1000, subtotal: 1000 }
  ]
};

submitInvoiceToETIMS(testInvoice, storeConfig)
  .then(result => console.log('Result:', result))
  .catch(error => console.error('Error:', error));
```

Run: `node test-etims.js`

---

### Step 8: Handle Errors

Add error handling:

```javascript
try {
  const result = await submitInvoiceToETIMS(invoice, storeConfig);
  if (!result.success) {
    // Log error, retry, or notify admin
    console.error('ETIMS failed:', result.error);
  }
} catch (error) {
  console.error('ETIMS error:', error);
  // Handle error appropriately
}
```

---

### Step 9: Go Live

Once tested in sandbox:

1. Switch to production credentials
2. Update `ETIMS_CONFIG.environment = 'production'`
3. Update production API URLs
4. Test with real invoice
5. Monitor for errors

---

## 📚 Key Files

1. **`ETIMS_INTEGRATION_TEMPLATE.js`** - Code template
2. **`ETIMS_SELF_INTEGRATION_GUIDE.md`** - Detailed guide
3. **`HOW_TO_INTEGRATE_ETIMS_YOURSELF.md`** - This file

---

## ⚠️ Important Notes

### 1. Follow KRA Documentation Exactly
- Use exact field names from KRA docs
- Use exact data formats
- Use exact API endpoints

### 2. Test Thoroughly
- Always test in sandbox first
- Test with different invoice types
- Test error scenarios

### 3. Handle Errors Gracefully
- ETIMS may fail (network, KRA server, etc.)
- Store invoices locally even if ETIMS fails
- Retry failed submissions
- Log all errors

### 4. Security
- Store credentials securely (environment variables)
- Never commit credentials to code
- Use `.env` file for credentials

### 5. Compliance
- Ensure invoices meet KRA requirements
- Keep records of all submissions
- Handle tax calculations correctly (16% VAT)

---

## 🆘 Common Issues

### Issue: "Authentication failed"
**Solution:** Check Consumer Key and Secret are correct

### Issue: "Invalid invoice format"
**Solution:** Check KRA documentation and adjust format

### Issue: "Network timeout"
**Solution:** Add retry logic or increase timeout

### Issue: "Field missing"
**Solution:** Check KRA documentation for required fields

---

## 📞 Getting Help

1. **KRA Documentation:** Check ETIMS API documentation from KRA
2. **KRA Support:** Contact KRA directly for API questions
3. **Error Messages:** Review error responses from KRA API
4. **Testing:** Use sandbox environment to debug

---

## 🎯 Summary

**To integrate ETIMS yourself:**

1. ✅ Get API credentials from KRA
2. ✅ Install axios package
3. ✅ Create `etims-api.js` file (use template)
4. ✅ Configure credentials
5. ✅ Adjust invoice format (follow KRA docs)
6. ✅ Integrate into server.js
7. ✅ Test in sandbox
8. ✅ Handle errors
9. ✅ Go live

**Time Estimate:** 1-2 weeks (depending on your experience and KRA documentation)

**Difficulty:** Medium (requires basic programming knowledge)

---

## 💡 Tips

- **Start Simple:** Get basic submission working first, then add features
- **Read KRA Docs:** KRA documentation is your best friend
- **Test Everything:** Test in sandbox before production
- **Log Everything:** Log all requests/responses for debugging
- **Be Patient:** API integration takes time, be patient

---

**Good luck with your ETIMS integration!** 🚀

Remember: Follow KRA documentation exactly, test in sandbox first, and handle errors gracefully.
