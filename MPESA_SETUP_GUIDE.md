# 📱 M-Pesa Integration Guide

## ✅ What You Have Now (DEMO MODE)

Your system currently has:
- ✅ Phone number input
- ✅ Payment flow simulation
- ✅ M-Pesa button and UI
- ✅ Receipt with M-Pesa details
- ✅ Perfect for testing

---

## 🚀 To Enable REAL M-Pesa Payments

### Requirements:

#### 1. **M-Pesa Business Account**
You need one of these:
- **Paybill Number** (for businesses)
- **Till Number** (for retail)

**How to get:**
1. Visit any Safaricom shop
2. Request "M-Pesa for Business"
3. Provide:
   - Business registration
   - KRA PIN
   - ID copies
4. Wait 3-5 days for approval

**Cost:**
- FREE to register
- 0% - 1.5% transaction fee
- Settlement to bank account

---

#### 2. **Daraja API Access**
After getting business account:
1. Go to: https://developer.safaricom.co.ke/
2. Create account
3. Register your app
4. Get API credentials:
   - Consumer Key
   - Consumer Secret
   - Pass Key (for STK Push)
   - Shortcode (your paybill/till number)

---

#### 3. **Backend Server**
M-Pesa requires a server because:
- API keys must be kept secret
- Can't call M-Pesa from browser (security)
- Need to handle callbacks

**Options:**
- Node.js + Express (recommended)
- Python + Flask
- PHP
- Any backend language

---

## 🔧 Technical Implementation

### **What Happens in Real M-Pesa:**

```
1. Customer buys items (KES 650)
2. Cashier selects M-Pesa
3. Enters customer phone: 0712345678
4. Clicks "Complete Sale"
5. System calls M-Pesa API (STK Push)
6. Customer receives popup on phone
7. Customer enters M-Pesa PIN
8. Payment processed
9. System receives callback (success/fail)
10. Receipt printed
```

---

### **API Flow:**

```javascript
// Backend API endpoint
POST /api/mpesa/stk-push

Request:
{
  "phone": "254712345678",
  "amount": 650,
  "accountReference": "SALE001",
  "transactionDesc": "Supermarket Purchase"
}

Response:
{
  "CheckoutRequestID": "ws_CO_123456789",
  "ResponseCode": "0",
  "ResponseDescription": "Success. Request accepted"
}

// Then wait for callback...
```

---

## 💰 M-Pesa Fees & Limits

| Transaction | Fee |
|-------------|-----|
| KES 1 - 49 | FREE |
| KES 50 - 100 | KES 0 |
| KES 101 - 500 | 1% |
| KES 501 - 2,500 | 1.5% |
| KES 2,501 - 70,000 | KES 25 |

**Max Transaction:** KES 150,000
**Daily Limit:** KES 300,000 (can be increased)

---

## 📋 Setup Checklist

### Phase 1: Get M-Pesa Business Account
- [ ] Visit Safaricom shop
- [ ] Apply for M-Pesa for Business
- [ ] Get paybill or till number
- [ ] Activate account
- [ ] Test with personal M-Pesa

### Phase 2: Register on Daraja
- [ ] Create developer account
- [ ] Register app
- [ ] Get Consumer Key
- [ ] Get Consumer Secret
- [ ] Get Passkey
- [ ] Test in sandbox (test environment)

### Phase 3: Build Backend
- [ ] Create Node.js server
- [ ] Install M-Pesa SDK
- [ ] Set up endpoints
- [ ] Handle callbacks
- [ ] Test with sandbox
- [ ] Go live with production keys

### Phase 4: Update Frontend
- [ ] Replace simulation with real API calls
- [ ] Handle loading states
- [ ] Show real-time payment status
- [ ] Handle failures gracefully

---

## 🔌 Quick Backend Setup (Node.js)

### 1. Install Dependencies:
```bash
npm install express mpesa-nodejs cors
```

### 2. Create `server.js`:
```javascript
const express = require('express');
const Mpesa = require('mpesa-nodejs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mpesa = new Mpesa({
  consumerKey: 'YOUR_CONSUMER_KEY',
  consumerSecret: 'YOUR_CONSUMER_SECRET',
  passkey: 'YOUR_PASS_KEY',
  shortCode: 'YOUR_SHORTCODE',
  environment: 'sandbox' // Change to 'production' when ready
});

app.post('/api/mpesa/stk-push', async (req, res) => {
  const { phone, amount } = req.body;
  
  try {
    const response = await mpesa.stkPush({
      phoneNumber: phone,
      amount: amount,
      accountReference: 'SALE' + Date.now(),
      transactionDesc: 'Supermarket Purchase'
    });
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('M-Pesa server running on port 3001');
});
```

### 3. Start Server:
```bash
node server.js
```

---

## 🔄 Update Frontend (When Ready)

Replace the simulated `initiateMpesaPayment` function with:

```javascript
const initiateMpesaPayment = async () => {
  if (!mpesaPhone || mpesaPhone.length < 10) {
    alert('Please enter a valid phone number!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  setMpesaProcessing(true);

  try {
    // Call your backend API
    const response = await fetch('http://localhost:3001/api/mpesa/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: mpesaPhone.startsWith('254') ? mpesaPhone : '254' + mpesaPhone.substring(1),
        amount: total
      })
    });

    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      alert('📱 M-Pesa prompt sent! Customer should check their phone.');
      
      // Poll for callback or wait for webhook
      // Then complete sale when payment confirmed
    } else {
      alert('❌ Failed to send M-Pesa prompt: ' + data.ResponseDescription);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    setMpesaProcessing(false);
  }
};
```

---

## 💡 Alternative: Use M-Pesa Aggregator

**Easier option:**
- **Pesapal** - https://www.pesapal.com/
- **DPO Pay** - https://www.dpopay.com/
- **Flutterwave** - https://flutterwave.com/ke

**Benefits:**
- Handles M-Pesa integration
- Also supports cards, banks
- Easier to implement
- Better support

**Costs:**
- 2-3.5% transaction fee
- No setup fee
- Faster implementation

---

## 📞 Contact Safaricom

**For M-Pesa for Business:**
- Phone: 0722 000 000
- Email: business@safaricom.co.ke
- Visit: Any Safaricom shop

**For Daraja API Support:**
- Portal: https://developer.safaricom.co.ke/
- Email: apisupport@safaricom.co.ke

---

## ⚡ Quick Start (Test Now)

**You can test the flow right now:**

1. Go to POS
2. Add items to cart
3. Select **M-Pesa**
4. Enter test phone: **0712345678**
5. Click "Complete Sale"
6. See simulation!

This helps you:
- ✅ Learn the workflow
- ✅ Train staff
- ✅ Test user experience
- ✅ Prepare for real integration

---

## 🎯 Timeline to Go Live

### Week 1: Apply for M-Pesa Business
- Visit Safaricom
- Submit documents
- Wait for approval

### Week 2: Get API Access
- Register on Daraja
- Get credentials
- Test in sandbox

### Week 3: Build Backend
- Set up Node.js server
- Integrate M-Pesa SDK
- Test thoroughly

### Week 4: Go Live
- Switch to production keys
- Test with real money (small amounts)
- Train staff
- Launch!

---

## ✅ For Now:

**Use the simulation mode to:**
1. Test the user interface
2. Train your staff
3. Show customers how it works
4. Perfect your workflow

**When you're ready for real M-Pesa:**
- I can help you build the backend
- I can integrate the real API
- I can set up callbacks
- I can add error handling

---

## 💬 Next Steps

**Tell me:**
- **"I want real M-Pesa now"** → I'll help you set it up
- **"How much will it cost?"** → I'll break down all costs
- **"What documents do I need?"** → I'll list everything
- **"Use aggregator instead"** → I'll show you Pesapal/Flutterwave
- **"Demo mode is fine for now"** → Great! Use it to train staff

**The M-Pesa prompt feature is ready to test!** 📱💚

