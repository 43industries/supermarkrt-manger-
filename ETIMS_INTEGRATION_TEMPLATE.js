/**
 * ETIMS API Integration Template
 * 
 * This is a template for integrating KRA ETIMS API.
 * Replace placeholders with actual values from KRA.
 * Follow KRA ETIMS API documentation exactly.
 */

const axios = require('axios');
const crypto = require('crypto');

// ============================================
// STEP 1: CONFIGURATION
// ============================================
// Get these values from KRA ETIMS portal

const ETIMS_CONFIG = {
  // Get these from KRA after registering for API access
  consumerKey: 'YOUR_CONSUMER_KEY_FROM_KRA',
  consumerSecret: 'YOUR_CONSUMER_SECRET_FROM_KRA',
  
  // API URLs (check KRA documentation for exact URLs)
  accessTokenURL: 'https://etims-api.kra.go.ke/oauth/token', // Example - check KRA docs
  apiBaseURL: 'https://etims-api.kra.go.ke/api', // Example - check KRA docs
  
  // Environment
  environment: 'sandbox' // Change to 'production' when ready
};

// ============================================
// STEP 2: AUTHENTICATION
// ============================================

/**
 * Get OAuth 2.0 Access Token from KRA
 * Check KRA documentation for exact authentication method
 */
async function getAccessToken() {
  try {
    // Method 1: Client Credentials Grant (example)
    const response = await axios.post(ETIMS_CONFIG.accessTokenURL, {
      grant_type: 'client_credentials',
      consumer_key: ETIMS_CONFIG.consumerKey,
      consumer_secret: ETIMS_CONFIG.consumerSecret
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.access_token;
    
    // Method 2: If KRA requires signature (check documentation)
    // const timestamp = new Date().toISOString();
    // const signature = generateSignature(timestamp);
    // const response = await axios.post(ETIMS_CONFIG.accessTokenURL, {
    //   grant_type: 'client_credentials',
    //   consumer_key: ETIMS_CONFIG.consumerKey,
    //   consumer_secret: ETIMS_CONFIG.consumerSecret,
    //   timestamp: timestamp,
    //   signature: signature
    // });
    // return response.data.access_token;
    
  } catch (error) {
    console.error('ETIMS Authentication Error:', error.response?.data || error.message);
    throw new Error('Failed to get ETIMS access token');
  }
}

/**
 * Generate signature (if required by KRA)
 * Check KRA documentation for exact signature method
 */
function generateSignature(timestamp) {
  const message = `${ETIMS_CONFIG.consumerKey}${timestamp}${ETIMS_CONFIG.consumerSecret}`;
  return crypto.createHash('sha256').update(message).digest('hex');
}

// ============================================
// STEP 3: INVOICE FORMATTING
// ============================================

/**
 * Convert your invoice to ETIMS format
 * IMPORTANT: Follow KRA documentation exactly for field names and format
 */
function formatInvoiceForETIMS(invoice, storeConfig) {
  // This is a TEMPLATE - adjust according to KRA ETIMS API documentation
  
  return {
    // Basic invoice information
    invoiceNo: invoice.invoiceNo,
    date: invoice.date,
    time: invoice.time || new Date().toTimeString().split(' ')[0],
    
    // Seller (your business) information
    seller: {
      pin: storeConfig.taxPin, // Your KRA PIN (e.g., P051234567X)
      name: storeConfig.storeName,
      address: storeConfig.address || '',
      phone: storeConfig.phone || '',
      email: storeConfig.email || ''
    },
    
    // Buyer (customer) information
    buyer: {
      pin: invoice.customer_taxId || null, // Customer KRA PIN (optional)
      name: invoice.customer_name || 'Walk-in Customer',
      address: invoice.customer_address || '',
      phone: invoice.customer_phone || '',
      email: invoice.customer_email || ''
    },
    
    // Invoice items
    items: (invoice.items || []).map(item => ({
      itemCode: item.product_id || item.id || '',
      itemName: item.product_name || item.name || '',
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || item.sellingPrice || 0,
      total: item.subtotal || (item.quantity * (item.unit_price || item.sellingPrice)),
      taxRate: 0.16, // 16% VAT - adjust if needed
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

// ============================================
// STEP 4: SUBMIT INVOICE TO ETIMS
// ============================================

/**
 * Submit invoice to KRA ETIMS
 * Returns: { success: true/false, data: {...}, error: '...' }
 */
async function submitInvoiceToETIMS(invoice, storeConfig) {
  try {
    // Step 1: Get access token
    console.log('Getting ETIMS access token...');
    const accessToken = await getAccessToken();
    
    // Step 2: Format invoice for ETIMS
    console.log('Formatting invoice for ETIMS...');
    const etimsInvoice = formatInvoiceForETIMS(invoice, storeConfig);
    
    // Step 3: Submit to ETIMS API
    console.log('Submitting invoice to ETIMS...');
    const response = await axios.post(
      `${ETIMS_CONFIG.apiBaseURL}/invoices`, // Check KRA docs for exact endpoint
      etimsInvoice,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    
    // Step 4: Return result
    console.log('ETIMS submission successful:', response.data);
    return {
      success: true,
      etimsInvoiceNo: response.data.invoiceNo, // KRA's invoice number
      kraReceipt: response.data.receiptNo, // KRA receipt number
      data: response.data
    };
    
  } catch (error) {
    console.error('ETIMS Submission Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication failed. Check your ETIMS credentials.'
      };
    }
    
    if (error.response?.status === 400) {
      return {
        success: false,
        error: 'Invalid invoice data',
        details: error.response.data
      };
    }
    
    if (error.response?.status === 500) {
      return {
        success: false,
        error: 'KRA server error. Please try again later.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

// ============================================
// STEP 5: VALIDATION
// ============================================

/**
 * Validate invoice before submission
 */
function validateInvoice(invoice) {
  const errors = [];
  
  if (!invoice.invoiceNo) errors.push('Invoice number is required');
  if (!invoice.date) errors.push('Date is required');
  if (!invoice.subtotal || invoice.subtotal <= 0) errors.push('Valid subtotal is required');
  if (!invoice.items || invoice.items.length === 0) errors.push('At least one item is required');
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// ============================================
// STEP 6: EXPORT FUNCTIONS
// ============================================

module.exports = {
  submitInvoiceToETIMS,
  validateInvoice,
  getAccessToken,
  ETIMS_CONFIG
};

// ============================================
// STEP 7: TESTING (Optional)
// ============================================

// Uncomment to test:
/*
async function test() {
  const testInvoice = {
    invoiceNo: 'INV-00001',
    date: '2026-01-11',
    customer_name: 'Test Customer',
    customer_taxId: 'P051234567X',
    subtotal: 1000,
    tax: 160,
    total: 1160,
    paymentMethod: 'Cash',
    items: [
      {
        product_id: 1,
        product_name: 'Test Product',
        quantity: 1,
        unit_price: 1000,
        subtotal: 1000
      }
    ]
  };
  
  const storeConfig = {
    taxPin: 'P051234567X', // Your KRA PIN
    storeName: 'Your Store Name',
    address: 'Your Address',
    phone: 'Your Phone',
    email: 'Your Email'
  };
  
  const result = await submitInvoiceToETIMS(testInvoice, storeConfig);
  console.log('Test Result:', result);
}

// test();
*/
