/**
 * Vercel Serverless Function Wrapper
 * This file wraps the Express app for Vercel's serverless environment
 */

const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// M-Pesa Configuration from environment variables
const MPESA_CONFIG = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
    shortcode: process.env.MPESA_SHORTCODE || '174379', // Sandbox default
    passkey: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', // Sandbox default
    callbackUrl: process.env.MPESA_CALLBACK_URL || (process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}/api/mpesa/callback`
        : 'https://your-domain.com/api/mpesa/callback'),
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox' // 'sandbox' or 'production'
};

// Get base URL based on environment
const getBaseUrl = () => {
    return MPESA_CONFIG.environment === 'production' 
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';
};

// Store for pending transactions (in production, use a database)
// Note: This is in-memory and will reset on each serverless function invocation
// For production, use Vercel KV, Vercel Postgres, or another database
const pendingTransactions = new Map();

// Generate timestamp for M-Pesa
const getTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
};

// Generate password for M-Pesa
const getPassword = (timestamp) => {
    const str = MPESA_CONFIG.shortcode + MPESA_CONFIG.passkey + timestamp;
    return Buffer.from(str).toString('base64');
};

// Get OAuth Access Token
const getAccessToken = async () => {
    try {
        const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
        
        const response = await axios.get(
            `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw new Error('Failed to get M-Pesa access token');
    }
};

// ============== API ROUTES ==============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: '43_Industries POS',
        mpesa: MPESA_CONFIG.environment,
        timestamp: new Date().toISOString(),
        platform: 'Vercel'
    });
});

// Check M-Pesa configuration
app.get('/api/mpesa/status', (req, res) => {
    const isConfigured = MPESA_CONFIG.consumerKey !== 'YOUR_CONSUMER_KEY';
    res.json({
        configured: isConfigured,
        environment: MPESA_CONFIG.environment,
        shortcode: MPESA_CONFIG.shortcode,
        message: isConfigured 
            ? 'M-Pesa is configured and ready' 
            : 'M-Pesa credentials not configured. Please update environment variables in Vercel.'
    });
});

// Initiate STK Push (Lipa Na M-Pesa Online)
app.post('/api/mpesa/stkpush', async (req, res) => {
    try {
        const { phone, amount, reference, description } = req.body;
        
        // Validate input
        if (!phone || !amount) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number and amount are required' 
            });
        }

        // Format phone number (remove leading 0, add 254)
        let formattedPhone = phone.toString().replace(/\s/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('+')) {
            formattedPhone = formattedPhone.substring(1);
        }
        if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone;
        }

        console.log(`\n📱 Initiating M-Pesa STK Push...`);
        console.log(`   Phone: ${formattedPhone}`);
        console.log(`   Amount: KES ${amount}`);
        console.log(`   Reference: ${reference || 'N/A'}`);

        // Check if using demo credentials
        if (MPESA_CONFIG.consumerKey === 'YOUR_CONSUMER_KEY') {
            console.log('⚠️  Using DEMO MODE - No real M-Pesa credentials configured');
            
            // Simulate STK push for demo
            const demoCheckoutId = 'ws_CO_DMO' + Date.now();
            pendingTransactions.set(demoCheckoutId, {
                phone: formattedPhone,
                amount,
                reference,
                status: 'pending',
                timestamp: new Date().toISOString(),
                demo: true
            });

            return res.json({
                success: true,
                demo: true,
                message: 'DEMO MODE: STK Push simulated. Configure environment variables for real payments.',
                checkoutRequestId: demoCheckoutId,
                merchantRequestId: 'DEMO_' + Date.now(),
                responseDescription: 'Success. Request accepted for processing (DEMO)'
            });
        }

        // Get access token
        const accessToken = await getAccessToken();
        const timestamp = getTimestamp();
        const password = getPassword(timestamp);

        // Make STK Push request
        const response = await axios.post(
            `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: MPESA_CONFIG.shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.round(amount),
                PartyA: formattedPhone,
                PartyB: MPESA_CONFIG.shortcode,
                PhoneNumber: formattedPhone,
                CallBackURL: MPESA_CONFIG.callbackUrl,
                AccountReference: reference || '43Industries',
                TransactionDesc: description || 'Payment for goods'
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ STK Push Response:', response.data);

        // Store pending transaction
        if (response.data.CheckoutRequestID) {
            pendingTransactions.set(response.data.CheckoutRequestID, {
                phone: formattedPhone,
                amount,
                reference,
                status: 'pending',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            demo: false,
            checkoutRequestId: response.data.CheckoutRequestID,
            merchantRequestId: response.data.MerchantRequestID,
            responseCode: response.data.ResponseCode,
            responseDescription: response.data.ResponseDescription,
            customerMessage: response.data.CustomerMessage
        });

    } catch (error) {
        console.error('❌ STK Push Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.errorMessage || error.message || 'Failed to initiate M-Pesa payment'
        });
    }
});

// M-Pesa Callback URL (receives payment confirmation from Safaricom)
app.post('/api/mpesa/callback', (req, res) => {
    console.log('\n📥 M-Pesa Callback Received:');
    console.log(JSON.stringify(req.body, null, 2));

    try {
        const { Body } = req.body;
        
        if (Body.stkCallback) {
            const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
            
            // Update transaction status
            if (pendingTransactions.has(CheckoutRequestID)) {
                const transaction = pendingTransactions.get(CheckoutRequestID);
                transaction.status = ResultCode === 0 ? 'completed' : 'failed';
                transaction.resultCode = ResultCode;
                transaction.resultDesc = ResultDesc;
                
                if (ResultCode === 0 && Body.stkCallback.CallbackMetadata) {
                    // Extract payment details
                    const metadata = Body.stkCallback.CallbackMetadata.Item;
                    transaction.mpesaReceiptNumber = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
                    transaction.transactionDate = metadata.find(i => i.Name === 'TransactionDate')?.Value;
                    transaction.phoneNumber = metadata.find(i => i.Name === 'PhoneNumber')?.Value;
                }
                
                pendingTransactions.set(CheckoutRequestID, transaction);
                console.log('✅ Transaction updated:', transaction);
            }
        }

        // Acknowledge receipt
        res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });

    } catch (error) {
        console.error('Callback processing error:', error);
        res.json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
    }
});

// Check transaction status
app.get('/api/mpesa/status/:checkoutRequestId', async (req, res) => {
    const { checkoutRequestId } = req.params;
    
    // Check local cache first
    if (pendingTransactions.has(checkoutRequestId)) {
        const transaction = pendingTransactions.get(checkoutRequestId);
        
        // For demo mode, simulate success after a few seconds
        if (transaction.demo) {
            return res.json({
                success: true,
                demo: true,
                status: 'completed',
                message: 'DEMO: Payment simulated as successful',
                transaction
            });
        }
        
        return res.json({
            success: true,
            status: transaction.status,
            transaction
        });
    }

    // If not in cache and real credentials, query M-Pesa
    if (MPESA_CONFIG.consumerKey !== 'YOUR_CONSUMER_KEY') {
        try {
            const accessToken = await getAccessToken();
            const timestamp = getTimestamp();
            const password = getPassword(timestamp);

            const response = await axios.post(
                `${getBaseUrl()}/mpesa/stkpushquery/v1/query`,
                {
                    BusinessShortCode: MPESA_CONFIG.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    CheckoutRequestID: checkoutRequestId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return res.json({
                success: true,
                status: response.data.ResultCode === '0' ? 'completed' : 'pending',
                data: response.data
            });

        } catch (error) {
            console.error('Status query error:', error.response?.data || error.message);
        }
    }

    res.json({
        success: false,
        status: 'unknown',
        message: 'Transaction not found'
    });
});

// Simulate payment completion (for demo/testing)
app.post('/api/mpesa/simulate-complete/:checkoutRequestId', (req, res) => {
    const { checkoutRequestId } = req.params;
    
    if (pendingTransactions.has(checkoutRequestId)) {
        const transaction = pendingTransactions.get(checkoutRequestId);
        transaction.status = 'completed';
        transaction.mpesaReceiptNumber = 'SIM' + Date.now();
        transaction.completedAt = new Date().toISOString();
        pendingTransactions.set(checkoutRequestId, transaction);
        
        return res.json({
            success: true,
            message: 'Payment simulated as complete',
            transaction
        });
    }
    
    res.status(404).json({
        success: false,
        message: 'Transaction not found'
    });
});

// Export the Express app wrapped as a serverless function
// This is what Vercel expects - a handler function, not the Express app directly
module.exports = serverless(app);

