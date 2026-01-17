/**
 * ETIMS Integration Module
 * 
 * This module handles ETIMS (KRA Electronic Tax Invoice Management System) integration.
 * 
 * IMPORTANT: You need KRA ETIMS API credentials to use this:
 * 1. Register at https://etims.kra.go.ke
 * 2. Get API credentials (Consumer Key, Consumer Secret, API URLs)
 * 3. Enter credentials in Settings → ETIMS Configuration
 */

const axios = require('axios');

// ETIMS Configuration (set via Settings)
let ETIMS_CONFIG = {
  enabled: false,
  consumerKey: '',
  consumerSecret: '',
  accessTokenURL: 'https://etims-api.kra.go.ke/oauth/token',
  apiBaseURL: 'https://etims-api.kra.go.ke/api',
  environment: 'sandbox' // or 'production'
};

/**
 * Update ETIMS configuration
 */
function updateETIMSConfig(config) {
  ETIMS_CONFIG = { ...ETIMS_CONFIG, ...config };
  return ETIMS_CONFIG;
}

/**
 * Get ETIMS configuration
 */
function getETIMSConfig() {
  return { ...ETIMS_CONFIG };
}

/**
 * Get OAuth 2.0 access token from KRA
 */
async function getAccessToken() {
  if (!ETIMS_CONFIG.enabled || !ETIMS_CONFIG.consumerKey || !ETIMS_CONFIG.consumerSecret) {
    throw new Error('ETIMS is not configured. Please configure ETIMS in Settings.');
  }

  try {
    const response = await axios.post(ETIMS_CONFIG.accessTokenURL, {
      grant_type: 'client_credentials',
      consumer_key: ETIMS_CONFIG.consumerKey,
      consumer_secret: ETIMS_CONFIG.consumerSecret
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return response.data.access_token;
  } catch (error) {
    console.error('ETIMS Authentication Error:', error.response?.data || error.message);
    throw new Error(`ETIMS authentication failed: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Format invoice for ETIMS
 */
function formatInvoiceForETIMS(invoice, storeConfig) {
  return {
    invoiceNo: invoice.invoiceNo,
    date: invoice.date,
    time: new Date().toTimeString().split(' ')[0],
    
    seller: {
      pin: storeConfig.taxPin || '',
      name: storeConfig.storeName || '',
      address: storeConfig.address || '',
      phone: storeConfig.phone || '',
      email: storeConfig.email || ''
    },
    
    buyer: {
      pin: invoice.customer_taxId || null,
      name: invoice.customer_name || 'Walk-in Customer',
      address: invoice.customer_address || '',
      phone: invoice.customer_phone || '',
      email: invoice.customer_email || ''
    },
    
    items: (invoice.items || []).map(item => ({
      itemCode: item.product_id || item.id || '',
      itemName: item.product_name || item.name || '',
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || item.sellingPrice || 0,
      total: item.subtotal || (item.quantity * (item.unit_price || item.sellingPrice)),
      taxRate: 0.16,
      taxAmount: (item.subtotal || (item.quantity * (item.unit_price || item.sellingPrice))) * 0.16
    })),
    
    subtotal: invoice.subtotal,
    tax: invoice.tax || (invoice.subtotal * 0.16),
    total: invoice.total,
    paymentMethod: invoice.paymentMethod || 'Cash',
    currency: 'KES',
    exchangeRate: 1
  };
}

/**
 * Submit invoice to ETIMS
 */
async function submitInvoiceToETIMS(invoice, storeConfig) {
  if (!ETIMS_CONFIG.enabled) {
    throw new Error('ETIMS is not enabled. Please enable and configure ETIMS in Settings.');
  }

  try {
    // Get access token
    const accessToken = await getAccessToken();
    
    // Format invoice
    const etimsInvoice = formatInvoiceForETIMS(invoice, storeConfig);
    
    // Submit to ETIMS
    const response = await axios.post(
      `${ETIMS_CONFIG.apiBaseURL}/invoices`,
      etimsInvoice,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return {
      success: true,
      etimsInvoiceNo: response.data.invoiceNo,
      kraReceipt: response.data.receiptNo,
      data: response.data
    };
  } catch (error) {
    console.error('ETIMS Submission Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('ETIMS authentication failed. Please check your credentials.');
    }
    if (error.response?.status === 400) {
      throw new Error(`Invalid invoice data: ${JSON.stringify(error.response.data)}`);
    }
    if (error.response?.status === 500) {
      throw new Error('KRA server error. Please try again later.');
    }
    
    throw new Error(`ETIMS submission failed: ${error.message}`);
  }
}

/**
 * Test ETIMS connection
 */
async function testETIMSConnection() {
  try {
    const token = await getAccessToken();
    return {
      success: true,
      message: 'ETIMS connection successful!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = {
  updateETIMSConfig,
  getETIMSConfig,
  submitInvoiceToETIMS,
  testETIMSConnection
};
