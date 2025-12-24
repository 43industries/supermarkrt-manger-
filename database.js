const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'supermarket.db');
let db = null;

// Initialize database and create tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    // Check if database exists, if not create it
    const dbExists = fs.existsSync(DB_PATH);
    
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
      
      // Performance optimizations for older hardware (4GB RAM system)
      db.run('PRAGMA foreign_keys = ON');
      db.run('PRAGMA journal_mode = WAL'); // Write-Ahead Logging for better performance
      db.run('PRAGMA synchronous = NORMAL'); // Balance between performance and safety
      db.run('PRAGMA cache_size = -8000'); // 8MB cache (reduced for 4GB RAM systems)
      db.run('PRAGMA temp_store = MEMORY'); // Store temporary tables in memory
      db.run('PRAGMA mmap_size = 67108864'); // 64MB memory-mapped I/O (reduced for older hardware)
      db.run('PRAGMA page_size = 4096'); // Optimal page size
      db.run('PRAGMA busy_timeout = 5000'); // Wait up to 5 seconds when locked
      db.run('PRAGMA optimize'); // Optimize database statistics
      
      // Create tables
      createTables()
        .then(() => {
          if (!dbExists) {
            console.log('📦 Seeding initial data...');
            return seedInitialData();
          }
          return Promise.resolve();
        })
        .then(() => {
          console.log('✅ Database initialized successfully');
          resolve();
        })
        .catch(reject);
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        category TEXT,
        costPrice REAL NOT NULL,
        sellingPrice REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        reorderLevel INTEGER DEFAULT 10,
        supplier TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating products table:', err);
          reject(err);
          return;
        }
      });

      // Suppliers table
      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT,
        email TEXT,
        products INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating suppliers table:', err);
          reject(err);
          return;
        }
      });

      // Customers table
      db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        points INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating customers table:', err);
          reject(err);
          return;
        }
      });

      // Sales table
      db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        items INTEGER DEFAULT 0,
        total REAL NOT NULL,
        profit REAL NOT NULL,
        customer TEXT,
        paymentMethod TEXT,
        cashier TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating sales table:', err);
          reject(err);
          return;
        }
      });

      // Sale items table (for detailed sale records)
      db.run(`CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Error creating sale_items table:', err);
          reject(err);
          return;
        }
      });

      // Create indexes for better query performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)`, (err) => {
        if (err) console.error('Error creating barcode index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`, (err) => {
        if (err) console.error('Error creating category index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)`, (err) => {
        if (err) console.error('Error creating product name index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date)`, (err) => {
        if (err) console.error('Error creating sales date index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id)`, (err) => {
        if (err) console.error('Error creating sale_items index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)`, (err) => {
        if (err) console.error('Error creating customer phone index:', err);
        else resolve();
      });
    });
  });
}

function seedInitialData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Check if data already exists
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row.count > 0) {
          // Data already exists, skip seeding
          resolve();
          return;
        }

        // Insert default products
        const defaultProducts = [
          ['Rice 5kg', '8901234567890', 'Grains', 450, 650, 45, 10, 'Grain Traders Ltd'],
          ['Cooking Oil 2L', '8901234567891', 'Oils', 280, 380, 8, 15, 'Oil Distributors'],
          ['Sugar 1kg', '8901234567892', 'Sweeteners', 95, 135, 120, 20, 'Sugar Corp'],
          ['Milk 1L', '8901234567893', 'Dairy', 55, 80, 5, 25, 'Dairy Fresh'],
          ['Bread Loaf', '8901234567894', 'Bakery', 35, 55, 30, 10, 'Local Bakery'],
          ['Tea 250g', '8901234567895', 'Beverages', 180, 250, 60, 15, 'Tea Corp'],
        ];

        const productStmt = db.prepare('INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        defaultProducts.forEach(product => {
          productStmt.run(product);
        });
        productStmt.finalize();

        // Insert default suppliers
        const defaultSuppliers = [
          ['Grain Traders Ltd', '+254712345678', 'info@graintraders.co.ke', 15],
          ['Oil Distributors', '+254723456789', 'sales@oildist.co.ke', 8],
          ['Sugar Corp', '+254734567890', 'orders@sugarcorp.co.ke', 5],
          ['Dairy Fresh', '+254745678901', 'contact@dairyfresh.co.ke', 12],
        ];

        const supplierStmt = db.prepare('INSERT INTO suppliers (name, contact, email, products) VALUES (?, ?, ?, ?)');
        defaultSuppliers.forEach(supplier => {
          supplierStmt.run(supplier);
        });
        supplierStmt.finalize();

        // Insert default customers
        const defaultCustomers = [
          ['John Doe', '+254700111222', 'john@email.com', 450, 12500],
          ['Jane Smith', '+254700333444', 'jane@email.com', 780, 23400],
          ['Bob Wilson', '+254700555666', 'bob@email.com', 320, 8900],
        ];

        const customerStmt = db.prepare('INSERT INTO customers (name, phone, email, points, totalSpent) VALUES (?, ?, ?, ?, ?)');
        defaultCustomers.forEach(customer => {
          customerStmt.run(customer);
        });
        customerStmt.finalize();

        console.log('✅ Initial data seeded');
        resolve();
      });
    });
  });
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase
};

