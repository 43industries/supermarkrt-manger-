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
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        pin TEXT,
        phone TEXT,
        email TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

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

      // Expenses table
      db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        paymentMethod TEXT,
        reference TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating expenses table:', err);
          reject(err);
          return;
        }
      });

      // Purchases table
      db.run(`CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        supplier TEXT NOT NULL,
        invoiceNo TEXT,
        total REAL NOT NULL,
        amountPaid REAL DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        items TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('Error creating purchases table:', err);
          reject(err);
          return;
        }
      });

      // Invoices table
      db.run(`CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoiceNo TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        sale_id INTEGER,
        customer_name TEXT,
        customer_address TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        customer_taxId TEXT,
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        paymentMethod TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating invoices table:', err);
          reject(err);
          return;
        }
      });

      // Returns table
      db.run(`CREATE TABLE IF NOT EXISTS returns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        returnNo TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        sale_id INTEGER NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        reason TEXT NOT NULL,
        refundAmount REAL NOT NULL,
        refundMethod TEXT,
        status TEXT DEFAULT 'Pending',
        processedBy TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT
      )`, (err) => {
        if (err) {
          console.error('Error creating returns table:', err);
          reject(err);
          return;
        }
      });

      // Return items table (for tracking individual returned items)
      db.run(`CREATE TABLE IF NOT EXISTS return_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        return_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        reason TEXT,
        restocked INTEGER DEFAULT 0,
        FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating return_items table:', err);
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
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`, (err) => {
        if (err) console.error('Error creating expenses date index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category)`, (err) => {
        if (err) console.error('Error creating expenses category index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date)`, (err) => {
        if (err) console.error('Error creating purchases date index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier)`, (err) => {
        if (err) console.error('Error creating purchases supplier index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date)`, (err) => {
        if (err) console.error('Error creating invoices date index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_invoices_invoiceNo ON invoices(invoiceNo)`, (err) => {
        if (err) console.error('Error creating invoices invoiceNo index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_returns_date ON returns(date)`, (err) => {
        if (err) console.error('Error creating returns date index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_returns_sale_id ON returns(sale_id)`, (err) => {
        if (err) console.error('Error creating returns sale_id index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_returns_returnNo ON returns(returnNo)`, (err) => {
        if (err) console.error('Error creating returns returnNo index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON return_items(return_id)`, (err) => {
        if (err) console.error('Error creating return_items return_id index:', err);
      });
      
      db.run(`CREATE INDEX IF NOT EXISTS idx_return_items_product_id ON return_items(product_id)`, (err) => {
        if (err) console.error('Error creating return_items product_id index:', err);
      });

      // Activity logs table (enhanced audit logs)
      db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id INTEGER,
        description TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating activity_logs table:', err);
      });

      // Admin notifications table
      db.run(`CREATE TABLE IF NOT EXISTS admin_notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        action_type TEXT,
        action_id INTEGER,
        priority TEXT DEFAULT 'normal',
        read INTEGER DEFAULT 0,
        requires_action INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating admin_notifications table:', err);
      });

      // Branches table (multi-branch support)
      db.run(`CREATE TABLE IF NOT EXISTS branches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        manager_id INTEGER,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating branches table:', err);
      });

      // Stock movements table (real-time stock tracking)
      db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        branch_id INTEGER,
        movement_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        previous_stock INTEGER,
        new_stock INTEGER,
        reference_type TEXT,
        reference_id INTEGER,
        notes TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating stock_movements table:', err);
      });

      // Employee time tracking table (clock in/out)
      db.run(`CREATE TABLE IF NOT EXISTS employee_time_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        branch_id INTEGER,
        clock_in DATETIME NOT NULL,
        clock_out DATETIME,
        break_start DATETIME,
        break_end DATETIME,
        total_hours REAL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating employee_time_logs table:', err);
      });

      // Accounting ledger table (General Ledger)
      db.run(`CREATE TABLE IF NOT EXISTS ledger_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        account_type TEXT NOT NULL,
        account_name TEXT NOT NULL,
        debit REAL DEFAULT 0,
        credit REAL DEFAULT 0,
        description TEXT,
        reference_type TEXT,
        reference_id INTEGER,
        branch_id INTEGER,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating ledger_entries table:', err);
      });

      // Accounts Payable table
      db.run(`CREATE TABLE IF NOT EXISTS accounts_payable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_name TEXT NOT NULL,
        invoice_no TEXT,
        amount REAL NOT NULL,
        paid_amount REAL DEFAULT 0,
        due_date TEXT,
        status TEXT DEFAULT 'Pending',
        branch_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating accounts_payable table:', err);
      });

      // Accounts Receivable table
      db.run(`CREATE TABLE IF NOT EXISTS accounts_receivable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        invoice_no TEXT,
        amount REAL NOT NULL,
        paid_amount REAL DEFAULT 0,
        due_date TEXT,
        status TEXT DEFAULT 'Pending',
        branch_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
      )`, (err) => {
        if (err) console.error('Error creating accounts_receivable table:', err);
      });

      // Add branch_id to existing tables
      db.run(`ALTER TABLE sales ADD COLUMN branch_id INTEGER`, (err) => {
        // Ignore error if column already exists
      });
      db.run(`ALTER TABLE products ADD COLUMN branch_id INTEGER`, (err) => {
        // Ignore error if column already exists
      });
      db.run(`ALTER TABLE users ADD COLUMN branch_id INTEGER`, (err) => {
        // Ignore error if column already exists
      });

      // Create indexes for new tables
      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id)`, (err) => {
        if (err) console.error('Error creating activity_logs index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at)`, (err) => {
        if (err) console.error('Error creating activity_logs date index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id)`, (err) => {
        if (err) console.error('Error creating stock_movements index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at)`, (err) => {
        if (err) console.error('Error creating stock_movements date index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_employee_time_logs_user_id ON employee_time_logs(user_id)`, (err) => {
        if (err) console.error('Error creating employee_time_logs index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_ledger_entries_date ON ledger_entries(date)`, (err) => {
        if (err) console.error('Error creating ledger_entries date index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_type ON ledger_entries(account_type)`, (err) => {
        if (err) console.error('Error creating ledger_entries account index:', err);
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code)`, (err) => {
        if (err) console.error('Error creating branches code index:', err);
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
        
        // Seed default users (admin and cashiers)
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (err) {
            console.error('Error checking users:', err);
            resolve();
            return;
          }
          
          if (row.count === 0) {
            const defaultUsers = [
              ['admin', 'admin123', 'Admin', 'Admin', null, null, null, 1],
              ['samuel', 'samuel123', 'Samuel', 'Cashier', null, null, null, 1],
              ['michael', 'michael123', 'Michael', 'Cashier', null, null, null, 1]
            ];
            
            const userStmt = db.prepare('INSERT INTO users (username, password, name, role, pin, phone, email, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            defaultUsers.forEach(user => {
              userStmt.run(user);
            });
            userStmt.finalize();
            
            console.log('✅ Default users created: admin, samuel, michael');
          }
          
          resolve();
        });
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

