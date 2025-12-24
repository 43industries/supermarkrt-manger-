/**
 * LAN Server for Supermarket POS System
 * Works on local network (Ethernet cables) - No internet needed!
 * 
 * SETUP:
 * 1. Connect all computers to same network/router with Ethernet cables
 * 2. Run: node LAN_SERVER.js
 * 3. Find your computer's IP address (shown in console)
 * 4. Other computers access: http://YOUR_IP:3000
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve all files

// In-memory database (stored in RAM)
let database = {
  products: [],
  sales: [],
  customers: [],
  suppliers: [],
  purchases: [],
  invoices: [],
  expenses: []
};

// Helper function to save to file (backup)
const fs = require('fs');
const DB_FILE = path.join(__dirname, 'lan_database.json');

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      database = JSON.parse(data);
      console.log('✅ Database loaded from file');
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Load database on start
loadDatabase();
// Auto-save every 30 seconds
setInterval(saveDatabase, 30000);

// API Routes

// Products
app.get('/api/products', (req, res) => {
  res.json(database.products);
});

app.post('/api/products', (req, res) => {
  const product = { id: Date.now(), ...req.body };
  database.products.push(product);
  saveDatabase();
  res.json(product);
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = database.products.findIndex(p => p.id === id);
  if (index !== -1) {
    database.products[index] = { ...database.products[index], ...req.body };
    saveDatabase();
    res.json(database.products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  database.products = database.products.filter(p => p.id !== id);
  saveDatabase();
  res.json({ success: true });
});

// Sales
app.get('/api/sales', (req, res) => {
  res.json(database.sales);
});

app.post('/api/sales', (req, res) => {
  const sale = { id: Date.now(), ...req.body };
  database.sales.push(sale);
  saveDatabase();
  res.json(sale);
});

// Customers
app.get('/api/customers', (req, res) => {
  res.json(database.customers);
});

app.post('/api/customers', (req, res) => {
  const customer = { id: Date.now(), ...req.body };
  database.customers.push(customer);
  saveDatabase();
  res.json(customer);
});

app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = database.customers.findIndex(c => c.id === id);
  if (index !== -1) {
    database.customers[index] = { ...database.customers[index], ...req.body };
    saveDatabase();
    res.json(database.customers[index]);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// Suppliers
app.get('/api/suppliers', (req, res) => {
  res.json(database.suppliers);
});

app.post('/api/suppliers', (req, res) => {
  const supplier = { id: Date.now(), ...req.body };
  database.suppliers.push(supplier);
  saveDatabase();
  res.json(supplier);
});

// Purchases
app.get('/api/purchases', (req, res) => {
  res.json(database.purchases);
});

app.post('/api/purchases', (req, res) => {
  const purchase = { id: Date.now(), ...req.body };
  database.purchases.push(purchase);
  saveDatabase();
  res.json(purchase);
});

app.put('/api/purchases/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = database.purchases.findIndex(p => p.id === id);
  if (index !== -1) {
    database.purchases[index] = { ...database.purchases[index], ...req.body };
    saveDatabase();
    res.json(database.purchases[index]);
  } else {
    res.status(404).json({ error: 'Purchase not found' });
  }
});

// Invoices
app.get('/api/invoices', (req, res) => {
  res.json(database.invoices);
});

app.post('/api/invoices', (req, res) => {
  const invoice = { id: Date.now(), ...req.body };
  database.invoices.push(invoice);
  saveDatabase();
  res.json(invoice);
});

// Expenses
app.get('/api/expenses', (req, res) => {
  res.json(database.expenses);
});

app.post('/api/expenses', (req, res) => {
  const expense = { id: Date.now(), ...req.body };
  database.expenses.push(expense);
  saveDatabase();
  res.json(expense);
});

// Redirect root to offline system
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'complete-system-offline.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 LAN SERVER RUNNING - ETHERNET/LOCAL NETWORK');
  console.log('='.repeat(60));
  console.log(`\n📍 Access from THIS computer:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📍 Access from OTHER computers on network:`);
  console.log(`   http://${localIP}:${PORT}`);
  console.log(`\n💡 Share this IP address with other computers:`);
  console.log(`   ${localIP}:${PORT}`);
  console.log('\n' + '='.repeat(60));
  console.log('✅ Server ready! All computers can now share data.');
  console.log('✅ Works with Ethernet cables - No internet needed!');
  console.log('='.repeat(60) + '\n');
});

