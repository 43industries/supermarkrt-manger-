/**
 * 43_Industries POS System - Backend Server
 * M-Pesa Daraja API Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get credentials from https://developer.safaricom.co.ke
 * 2. Create .env file with your credentials (see .env.example)
 * 3. Run: npm install
 * 4. Run: npm start
 * 5. Open: http://localhost:3000
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { initDatabase, getDatabase, closeDatabase } = require('./database');
const {
  logStockMovement,
  getStockMovements,
  getLowStockAlerts,
  createBranch,
  getBranches,
  clockIn,
  clockOut,
  getEmployeeTimeLogs,
  createLedgerEntry,
  getLedgerEntries,
  getAccountBalance,
  getTrialBalance,
  formatForQuickBooks
} = require('./enterprise-features');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve HTML files

// M-Pesa Configuration from environment variables
const MPESA_CONFIG = {
    consumerKey: process.env.MPESA_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
    shortcode: process.env.MPESA_SHORTCODE || '174379', // Sandbox default
    passkey: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919', // Sandbox default
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback',
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox' // 'sandbox' or 'production'
};

// Get base URL based on environment
const getBaseUrl = () => {
    return MPESA_CONFIG.environment === 'production' 
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';
};

// Store for pending transactions (in production, use a database)
const pendingTransactions = new Map();

// Database will be initialized when server starts

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

// ============== USER MANAGEMENT & AUTHENTICATION API ROUTES ==============

// User authentication
app.post('/api/auth/login', (req, res) => {
    const db = getDatabase();
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ? AND active = 1', [username], (err, user) => {
        if (err) {
            console.error('Error authenticating user:', err);
            return res.status(500).json({ error: 'Authentication failed' });
        }

        if (!user || user.password !== password) {
            // Log failed login attempt
            logActivity(db, null, 'LOGIN_FAILED', 'user', null, `Failed login attempt for username: ${username}`);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Update last login
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Log successful login
        logActivity(db, user.id, 'LOGIN', 'user', user.id, `User ${user.name} logged in`);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            user: userWithoutPassword,
            token: 'session_token_' + Date.now() // Simple token for session management
        });
    });
});

// Verify PIN for sensitive operations
app.post('/api/auth/verify-pin', (req, res) => {
    const db = getDatabase();
    const { userId, pin } = req.body;

    if (!userId || !pin) {
        return res.status(400).json({ error: 'User ID and PIN are required' });
    }

    db.get('SELECT * FROM users WHERE id = ? AND active = 1', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Verification failed' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If user has a PIN set, verify it; otherwise verify password as PIN
        const expectedPin = user.pin || user.password;
        const isValid = expectedPin === pin;

        if (isValid) {
            logActivity(db, userId, 'PIN_VERIFIED', 'user', userId, `PIN verified for user ${user.name}`);
            res.json({ success: true, verified: true });
        } else {
            logActivity(db, userId, 'PIN_FAILED', 'user', userId, `PIN verification failed for user ${user.name}`);
            res.json({ success: true, verified: false });
        }
    });
});

// Get all users (Admin only - should be protected in production)
app.get('/api/users', (req, res) => {
    const db = getDatabase();
    
    db.all('SELECT id, username, name, role, active, created_at, last_login FROM users ORDER BY role, name', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(rows || []);
    });
});

// Get single user
app.get('/api/users/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT id, username, name, role, active, created_at, last_login FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// Create new user (Admin only - for adding cashiers)
app.post('/api/users', (req, res) => {
    const db = getDatabase();
    const { username, password, name, role, phone, email } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    // Validate role
    if (!['Admin', 'Cashier'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either Admin or Cashier' });
    }

    // Check if username already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, existing) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).json({ error: 'Failed to check username' });
        }

        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create new user
        const sql = `INSERT INTO users (username, password, name, role, phone, email, active)
                     VALUES (?, ?, ?, ?, ?, ?, 1)`;

        db.run(sql, [username, password, name, role, phone || null, email || null], function(err) {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({ error: 'Failed to create user' });
            }

            // Log activity (using system/admin user ID if available)
            logActivity(db, null, 'USER_CREATED', 'user', this.lastID, `New ${role} account created: ${name} (${username})`);

            // Fetch the created user
            db.get('SELECT id, username, name, role, active, created_at, last_login FROM users WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'User created but failed to fetch' });
                }
                res.status(201).json(row);
            });
        });
    });
});

// Update user (password, PIN, etc.)
app.put('/api/users/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { password, pin, name, phone, email, active } = req.body;

    let updates = [];
    let values = [];

    if (password !== undefined) {
        updates.push('password = ?');
        values.push(password);
    }
    if (pin !== undefined) {
        updates.push('pin = ?');
        values.push(pin);
    }
    if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
    }
    if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
    }
    if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
    }
    if (active !== undefined) {
        updates.push('active = ?');
        values.push(active);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, values, function(err) {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        logActivity(db, id, 'USER_UPDATED', 'user', id, `User updated`);
        
        db.get('SELECT id, username, name, role, active, created_at, last_login FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'User updated but failed to fetch' });
            }
            res.json(row);
        });
    });
});

// Delete/Deactivate user
app.delete('/api/users/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    // Get user info before deletion
    db.get('SELECT username, name, role FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Don't allow deleting admin accounts
        if (user.role === 'Admin') {
            return res.status(400).json({ error: 'Cannot delete admin accounts' });
        }

        // Soft delete (deactivate) instead of hard delete
        db.run('UPDATE users SET active = 0 WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Error deactivating user:', err);
                return res.status(500).json({ error: 'Failed to deactivate user' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            logActivity(db, null, 'USER_DEACTIVATED', 'user', id, `User ${user.name} (${user.username}) deactivated`);
            
            res.json({ success: true, message: 'User deactivated successfully' });
        });
    });
});

// Get cashier/user statistics and performance
app.get('/api/users/:id/stats', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // Get user info
    db.get('SELECT id, username, name, role, created_at, last_login FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Build date filter
        let dateFilter = '';
        const params = [];

        if (startDate && endDate) {
            dateFilter = 'AND date >= ? AND date <= ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            dateFilter = 'AND date >= ?';
            params.push(startDate);
        } else if (endDate) {
            dateFilter = 'AND date <= ?';
            params.push(endDate);
        }

        // Get sales statistics for this cashier
        db.get(`SELECT 
                    COUNT(*) as totalSales,
                    COALESCE(SUM(total), 0) as totalRevenue,
                    COALESCE(SUM(profit), 0) as totalProfit,
                    COALESCE(AVG(total), 0) as avgTransactionValue
                FROM sales 
                WHERE cashier = ? ${dateFilter}`, 
                [user.name, ...params], (err, salesStats) => {
            if (err) {
                console.error('Error fetching sales stats:', err);
                return res.status(500).json({ error: 'Failed to fetch sales statistics' });
            }

            // Get activity logs count
            db.get(`SELECT COUNT(*) as activityCount 
                    FROM activity_logs 
                    WHERE user_id = ? ${dateFilter ? 'AND created_at >= ? AND created_at <= ?' : ''}`, 
                    dateFilter ? [id, startDate || '', endDate || ''] : [id], (err, activityResult) => {
                if (err) {
                    console.error('Error fetching activity count:', err);
                }

                // Get recent activity logs (last 20)
                db.all(`SELECT * FROM activity_logs 
                       WHERE user_id = ? 
                       ORDER BY created_at DESC 
                       LIMIT 20`, [id], (err, recentActivities) => {
                    if (err) {
                        console.error('Error fetching recent activities:', err);
                        recentActivities = [];
                    }

                    // Get today's sales
                    const today = new Date().toISOString().split('T')[0];
                    db.get(`SELECT 
                                COUNT(*) as todaySales,
                                COALESCE(SUM(total), 0) as todayRevenue
                            FROM sales 
                            WHERE cashier = ? AND date = ?`, 
                            [user.name, today], (err, todayStats) => {
                        if (err) {
                            todayStats = { todaySales: 0, todayRevenue: 0 };
                        }

                        res.json({
                            user: user,
                            sales: {
                                total: salesStats.totalSales || 0,
                                revenue: salesStats.totalRevenue || 0,
                                profit: salesStats.totalProfit || 0,
                                avgTransaction: salesStats.avgTransactionValue || 0,
                                today: {
                                    sales: todayStats.todaySales || 0,
                                    revenue: todayStats.todayRevenue || 0
                                }
                            },
                            activity: {
                                total: activityResult?.activityCount || 0,
                                recent: recentActivities || []
                            }
                        });
                    });
                });
            });
        });
    });
});

// Activity logging helper function
function logActivity(db, userId, action, entityType, entityId, description, req = null) {
    const username = userId ? 'user_' + userId : 'system';
    const ipAddress = req ? (req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress) : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    db.run(
        'INSERT INTO activity_logs (user_id, username, action, entity_type, entity_id, description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, username, action, entityType, entityId, description, ipAddress, userAgent],
        (err) => {
            if (err) {
                console.error('Error logging activity:', err);
            }
        }
    );
}

// Get activity logs
app.get('/api/activity-logs', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.query.userId;
    const action = req.query.action;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params = [];

    if (userId) {
        query += ' AND user_id = ?';
        params.push(parseInt(userId));
    }

    if (action) {
        query += ' AND action = ?';
        params.push(action);
    }

    if (startDate) {
        query += ' AND created_at >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND created_at <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching activity logs:', err);
            return res.status(500).json({ error: 'Failed to fetch activity logs' });
        }
        res.json(rows || []);
    });
});

// Create admin notification
function createAdminNotification(db, type, title, message, actionType = null, actionId = null, priority = 'normal', requiresAction = 0) {
    db.run(
        'INSERT INTO admin_notifications (type, title, message, action_type, action_id, priority, requires_action) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [type, title, message, actionType, actionId, priority, requiresAction],
        (err) => {
            if (err) {
                console.error('Error creating admin notification:', err);
            }
        }
    );
}

// Get admin notifications
app.get('/api/admin/notifications', (req, res) => {
    const db = getDatabase();
    const unreadOnly = req.query.unreadOnly === 'true';
    const limit = parseInt(req.query.limit) || 100;

    let query = 'SELECT * FROM admin_notifications WHERE 1=1';
    const params = [];

    if (unreadOnly) {
        query += ' AND read = 0';
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Failed to fetch notifications' });
        }
        res.json(rows || []);
    });
});

// Mark notification as read
app.put('/api/admin/notifications/:id/read', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.run('UPDATE admin_notifications SET read = 1 WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error updating notification:', err);
            return res.status(500).json({ error: 'Failed to update notification' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification marked as read' });
    });
});

// Mark all notifications as read
app.put('/api/admin/notifications/read-all', (req, res) => {
    const db = getDatabase();

    db.run('UPDATE admin_notifications SET read = 1 WHERE read = 0', function(err) {
        if (err) {
            console.error('Error updating notifications:', err);
            return res.status(500).json({ error: 'Failed to update notifications' });
        }

        res.json({ success: true, message: 'All notifications marked as read', count: this.changes });
    });
});

// Void sale with PIN protection
app.post('/api/sales/:id/void', (req, res) => {
    const db = getDatabase();
    const saleId = parseInt(req.params.id);
    const { userId, pin } = req.body;

    if (!userId || !pin) {
        return res.status(400).json({ error: 'User ID and PIN are required for void operations' });
    }

    // Verify PIN first
    db.get('SELECT * FROM users WHERE id = ? AND active = 1', [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'User verification failed' });
        }

        const expectedPin = user.pin || user.password;
        if (expectedPin !== pin) {
            logActivity(db, userId, 'VOID_SALE_FAILED', 'sale', saleId, `PIN verification failed for void sale ${saleId}`);
            createAdminNotification(db, 'SECURITY', 'Failed Void Attempt', `User ${user.name} failed PIN verification for void sale #${saleId}`, 'sale', saleId, 'high', 1);
            return res.status(403).json({ error: 'Invalid PIN' });
        }

        // Get sale details
        db.get('SELECT * FROM sales WHERE id = ?', [saleId], (err, sale) => {
            if (err || !sale) {
                return res.status(404).json({ error: 'Sale not found' });
            }

            // Get sale items
            db.all('SELECT * FROM sale_items WHERE sale_id = ?', [saleId], (err, saleItems) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to fetch sale items' });
                }

                db.serialize(() => {
                    db.run('BEGIN TRANSACTION');

                    // Restore stock for each item
                    saleItems.forEach((item) => {
                        if (item.product_id) {
                            db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
                        }
                    });

                    // Mark sale as voided (add voided column or use status)
                    db.run('UPDATE sales SET cashier = cashier || " [VOIDED]" WHERE id = ?', [saleId], (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Failed to void sale' });
                        }

                        db.run('COMMIT', (err) => {
                            if (err) {
                                return res.status(500).json({ error: 'Failed to complete void operation' });
                            }

                            // Log activity
                            logActivity(db, userId, 'VOID_SALE', 'sale', saleId, `Sale ${saleId} voided by ${user.name}`);
                            
                            // Create admin notification
                            createAdminNotification(
                                db,
                                'VOID_SALE',
                                'Sale Voided',
                                `Sale #${saleId} (KES ${sale.total}) was voided by ${user.name}`,
                                'sale',
                                saleId,
                                'high',
                                1
                            );

                            res.json({ success: true, message: 'Sale voided successfully', saleId });
                        });
                    });
                });
            });
        });
    });
});

// ============== ITEM/PRODUCT INTEGRATION API ROUTES ==============

// Get all products/items
app.get('/api/products', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;
    const search = req.query.search;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (name LIKE ? OR barcode LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        res.json(rows || []);
    });
});

// Get single product/item by ID
app.get('/api/products/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    });
});

// Get product/item by barcode
app.get('/api/products/barcode/:barcode', (req, res) => {
    const db = getDatabase();
    const barcode = req.params.barcode;

    db.get('SELECT * FROM products WHERE barcode = ?', [barcode], (err, row) => {
        if (err) {
            console.error('Error fetching product by barcode:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    });
});

// Create new product/item
app.post('/api/products', (req, res) => {
    const db = getDatabase();
    const { name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Product name is required' });
    }

    const sql = `INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, barcode || null, category || null, costPrice || 0, sellingPrice || 0, 
                 stock || 0, reorderLevel || 10, supplier || null], function(err) {
        if (err) {
            console.error('Error creating product:', err);
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Product with this barcode already exists' });
            }
            return res.status(500).json({ error: 'Failed to create product' });
        }

        // Fetch the created product
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Product created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});

// Update product/item
app.put('/api/products/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier, userId } = req.body;

    // Get old stock value for logging
    db.get('SELECT stock, name FROM products WHERE id = ?', [id], (err, oldProduct) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
        if (!oldProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const oldStock = oldProduct.stock || 0;
        const newStock = stock !== undefined ? stock : oldStock;
        const stockChange = newStock - oldStock;

        const sql = `UPDATE products 
                     SET name = ?, barcode = ?, category = ?, costPrice = ?, sellingPrice = ?, 
                         stock = ?, reorderLevel = ?, supplier = ?
                     WHERE id = ?`;

        db.run(sql, [name, barcode || null, category || null, costPrice || 0, sellingPrice || 0,
                     stock !== undefined ? stock : oldStock, reorderLevel || 10, supplier || null, id], function(err) {
            if (err) {
                console.error('Error updating product:', err);
                if (err.message.includes('UNIQUE constraint')) {
                    return res.status(400).json({ error: 'Product with this barcode already exists' });
                }
                return res.status(500).json({ error: 'Failed to update product' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Log stock update
            if (stockChange !== 0 && userId) {
                const action = stockChange > 0 ? 'STOCK_ADD' : 'STOCK_UPDATE';
                const description = stockChange > 0 
                    ? `Stock increased by ${stockChange} for ${oldProduct.name || name} (${oldStock} → ${newStock})`
                    : `Stock updated for ${oldProduct.name || name} (${oldStock} → ${newStock})`;
                
                logActivity(db, userId, action, 'product', id, description);
                
                // Create admin notification for significant stock additions
                if (stockChange > 50) {
                    createAdminNotification(
                        db,
                        'STOCK_UPDATE',
                        'Large Stock Addition',
                        `${stockChange} units of ${oldProduct.name || name} added. New stock: ${newStock}`,
                        'product',
                        id,
                        'normal',
                        0
                    );
                }
            }

            // Fetch the updated product
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Product updated but failed to fetch' });
                }
                res.json(row);
            });
        });
    });
});

// Delete product/item
app.delete('/api/products/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    });
});

// Bulk import/integrate items (from JSON array)
app.post('/api/products/bulk-import', (req, res) => {
    const db = getDatabase();
    const items = req.body.items || req.body; // Support both { items: [...] } and [...]
    const itemsArray = Array.isArray(items) ? items : (Array.isArray(req.body.items) ? req.body.items : []);

    if (!itemsArray || itemsArray.length === 0) {
        return res.status(400).json({ error: 'No items provided for import' });
    }

    let imported = 0;
    let updated = 0;
    let errors = [];
    let processed = 0;

    // Process each item
    const processItem = (item, index) => {
        return new Promise((resolve) => {
            const name = item.name || item.Name || `Product ${item.barcode || item.Barcode || index + 1}`;
            const barcode = item.barcode || item.Barcode || null;
            const category = item.category || item.Category || null;
            const costPrice = parseFloat(item.costPrice || item['Cost Price'] || item.cost || item.Cost || 0) || 0;
            const sellingPrice = parseFloat(item.sellingPrice || item['Selling Price'] || item.price || item.Price || 0) || 0;
            const stock = parseInt(item.stock || item.Stock || item.quantity || item.Quantity || 0) || 0;
            const reorderLevel = parseInt(item.reorderLevel || item['Reorder Level'] || item.reorder || item.Reorder || 10) || 10;
            const supplier = item.supplier || item.Supplier || item.vendor || item.Vendor || null;

            if (barcode) {
                // Check if product exists by barcode
                db.get('SELECT id FROM products WHERE barcode = ?', [barcode], (err, row) => {
                    if (err) {
                        errors.push({ row: index + 1, barcode, error: err.message });
                        processed++;
                        resolve();
                        return;
                    }

                    if (row) {
                        // Update existing product
                        db.run(`UPDATE products SET name = ?, category = ?, costPrice = ?, sellingPrice = ?, 
                               stock = ?, reorderLevel = ?, supplier = ? WHERE id = ?`,
                            [name, category, costPrice, sellingPrice, stock, reorderLevel, supplier, row.id],
                            (err) => {
                                if (err) {
                                    errors.push({ row: index + 1, barcode, error: err.message });
                                } else {
                                    updated++;
                                }
                                processed++;
                                resolve();
                            }
                        );
                    } else {
                        // Insert new product
                        const sql = `INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        db.run(sql, [name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier],
                            (err) => {
                                if (err) {
                                    errors.push({ row: index + 1, barcode, error: err.message });
                                } else {
                                    imported++;
                                }
                                processed++;
                                resolve();
                            }
                        );
                    }
                });
            } else {
                // Insert without barcode
                const sql = `INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier],
                    (err) => {
                        if (err) {
                            errors.push({ row: index + 1, error: err.message });
                        } else {
                            imported++;
                        }
                        processed++;
                        resolve();
                    }
                );
            }
        });
    };

    // Process all items sequentially to avoid database locking issues
    const processAll = async () => {
        for (let i = 0; i < itemsArray.length; i++) {
            await processItem(itemsArray[i], i);
        }

        // Send response after all items are processed
        res.json({
            success: true,
            imported,
            updated,
            total: itemsArray.length,
            errors: errors.length > 0 ? errors : undefined
        });
    };

    processAll().catch(err => {
        console.error('Bulk import error:', err);
        res.status(500).json({ error: 'Failed to process bulk import', message: err.message });
    });
});

// Import items from external API
app.post('/api/products/integrate-external', async (req, res) => {
    try {
        const { apiUrl, apiKey, headers, mapping } = req.body;

        if (!apiUrl) {
            return res.status(400).json({ error: 'API URL is required' });
        }

        // Fetch data from external API
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
                ...headers
            }
        };

        const response = await axios.get(apiUrl, config);
        let externalItems = response.data;

        // Handle different response formats
        if (externalItems.data) externalItems = externalItems.data;
        if (externalItems.items) externalItems = externalItems.items;
        if (!Array.isArray(externalItems)) {
            externalItems = [externalItems];
        }

        // Map external data to our format
        const mappedItems = externalItems.map(item => {
            if (mapping) {
                // Use custom mapping
                return {
                    name: item[mapping.name || 'name'],
                    barcode: item[mapping.barcode || 'barcode'],
                    category: item[mapping.category || 'category'],
                    costPrice: item[mapping.costPrice || 'costPrice'],
                    sellingPrice: item[mapping.sellingPrice || 'sellingPrice'],
                    stock: item[mapping.stock || 'stock'],
                    reorderLevel: item[mapping.reorderLevel || 'reorderLevel'],
                    supplier: item[mapping.supplier || 'supplier']
                };
            } else {
                // Use default mapping (assuming same field names)
                return item;
            }
        });

        // Import mapped items using the same logic as bulk-import
        const db = getDatabase();
        let imported = 0;
        let updated = 0;
        let errors = [];

        // Process each item
        const processItem = (item, index) => {
            return new Promise((resolve) => {
                const name = item.name || `Product ${item.barcode || index + 1}`;
                const barcode = item.barcode || null;
                const category = item.category || null;
                const costPrice = parseFloat(item.costPrice || 0) || 0;
                const sellingPrice = parseFloat(item.sellingPrice || 0) || 0;
                const stock = parseInt(item.stock || 0) || 0;
                const reorderLevel = parseInt(item.reorderLevel || 10) || 10;
                const supplier = item.supplier || null;

                if (barcode) {
                    db.get('SELECT id FROM products WHERE barcode = ?', [barcode], (err, row) => {
                        if (err) {
                            errors.push({ row: index + 1, barcode, error: err.message });
                            resolve();
                            return;
                        }

                        if (row) {
                            db.run(`UPDATE products SET name = ?, category = ?, costPrice = ?, sellingPrice = ?, 
                                   stock = ?, reorderLevel = ?, supplier = ? WHERE id = ?`,
                                [name, category, costPrice, sellingPrice, stock, reorderLevel, supplier, row.id],
                                (err) => {
                                    if (err) {
                                        errors.push({ row: index + 1, barcode, error: err.message });
                                    } else {
                                        updated++;
                                    }
                                    resolve();
                                }
                            );
                        } else {
                            const sql = `INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier)
                                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                            db.run(sql, [name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier],
                                (err) => {
                                    if (err) {
                                        errors.push({ row: index + 1, barcode, error: err.message });
                                    } else {
                                        imported++;
                                    }
                                    resolve();
                                }
                            );
                        }
                    });
                } else {
                    const sql = `INSERT INTO products (name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    db.run(sql, [name, barcode, category, costPrice, sellingPrice, stock, reorderLevel, supplier],
                        (err) => {
                            if (err) {
                                errors.push({ row: index + 1, error: err.message });
                            } else {
                                imported++;
                            }
                            resolve();
                        }
                    );
                }
            });
        };

        // Process all items sequentially
        const processAll = async () => {
            for (let i = 0; i < mappedItems.length; i++) {
                await processItem(mappedItems[i], i);
            }

            res.json({
                success: true,
                imported,
                updated,
                total: mappedItems.length,
                errors: errors.length > 0 ? errors : undefined,
                source: 'external_api'
            });
        };

        processAll().catch(err => {
            console.error('External API integration error:', err);
            res.status(500).json({
                error: 'Failed to process external API integration',
                message: err.message
            });
        });

    } catch (error) {
        console.error('Error integrating external API:', error);
        res.status(500).json({
            error: 'Failed to integrate external API',
            message: error.message
        });
    }
});

// ============== FINANCE API ROUTES ==============

// Expenses endpoints
app.get('/api/expenses', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.status(500).json({ error: 'Failed to fetch expenses' });
        }
        res.json(rows || []);
    });
});

app.get('/api/expenses/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching expense:', err);
            return res.status(500).json({ error: 'Failed to fetch expense' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(row);
    });
});

app.post('/api/expenses', (req, res) => {
    const db = getDatabase();
    const { date, category, description, amount, paymentMethod, reference } = req.body;

    if (!date || !category || !amount) {
        return res.status(400).json({ error: 'Date, category, and amount are required' });
    }

    const sql = `INSERT INTO expenses (date, category, description, amount, paymentMethod, reference)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [date, category, description || null, amount, paymentMethod || null, reference || null], function(err) {
        if (err) {
            console.error('Error creating expense:', err);
            return res.status(500).json({ error: 'Failed to create expense' });
        }

        db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Expense created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});

app.put('/api/expenses/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { date, category, description, amount, paymentMethod, reference } = req.body;

    const sql = `UPDATE expenses 
                 SET date = ?, category = ?, description = ?, amount = ?, paymentMethod = ?, reference = ?
                 WHERE id = ?`;

    db.run(sql, [date, category, description || null, amount, paymentMethod || null, reference || null, id], function(err) {
        if (err) {
            console.error('Error updating expense:', err);
            return res.status(500).json({ error: 'Failed to update expense' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Expense updated but failed to fetch' });
            }
            res.json(row);
        });
    });
});

app.delete('/api/expenses/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting expense:', err);
            return res.status(500).json({ error: 'Failed to delete expense' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ success: true, message: 'Expense deleted successfully' });
    });
});

// Purchases endpoints
app.get('/api/purchases', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;
    const supplier = req.query.supplier;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = 'SELECT * FROM purchases WHERE 1=1';
    const params = [];

    if (supplier) {
        query += ' AND supplier = ?';
        params.push(supplier);
    }

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching purchases:', err);
            return res.status(500).json({ error: 'Failed to fetch purchases' });
        }
        // Parse items JSON if it exists
        const purchases = (rows || []).map(p => {
            if (p.items && typeof p.items === 'string') {
                try {
                    p.items = JSON.parse(p.items);
                } catch (e) {
                    p.items = [];
                }
            }
            return p;
        });
        res.json(purchases);
    });
});

app.get('/api/purchases/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM purchases WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching purchase:', err);
            return res.status(500).json({ error: 'Failed to fetch purchase' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        // Parse items JSON if it exists
        if (row.items && typeof row.items === 'string') {
            try {
                row.items = JSON.parse(row.items);
            } catch (e) {
                row.items = [];
            }
        }
        res.json(row);
    });
});

app.post('/api/purchases', (req, res) => {
    const db = getDatabase();
    const { date, supplier, invoiceNo, total, amountPaid, status, items, notes } = req.body;

    if (!date || !supplier || !total) {
        return res.status(400).json({ error: 'Date, supplier, and total are required' });
    }

    const itemsJson = items ? JSON.stringify(items) : null;
    const sql = `INSERT INTO purchases (date, supplier, invoiceNo, total, amountPaid, status, items, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [date, supplier, invoiceNo || null, total, amountPaid || 0, status || 'Pending', itemsJson, notes || null], function(err) {
        if (err) {
            console.error('Error creating purchase:', err);
            return res.status(500).json({ error: 'Failed to create purchase' });
        }

        db.get('SELECT * FROM purchases WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Purchase created but failed to fetch' });
            }
            if (row.items && typeof row.items === 'string') {
                try {
                    row.items = JSON.parse(row.items);
                } catch (e) {
                    row.items = [];
                }
            }
            res.status(201).json(row);
        });
    });
});

app.put('/api/purchases/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { date, supplier, invoiceNo, total, amountPaid, status, items, notes } = req.body;

    const itemsJson = items ? JSON.stringify(items) : null;
    const sql = `UPDATE purchases 
                 SET date = ?, supplier = ?, invoiceNo = ?, total = ?, amountPaid = ?, status = ?, items = ?, notes = ?
                 WHERE id = ?`;

    db.run(sql, [date, supplier, invoiceNo || null, total, amountPaid || 0, status || 'Pending', itemsJson, notes || null, id], function(err) {
        if (err) {
            console.error('Error updating purchase:', err);
            return res.status(500).json({ error: 'Failed to update purchase' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        db.get('SELECT * FROM purchases WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Purchase updated but failed to fetch' });
            }
            if (row.items && typeof row.items === 'string') {
                try {
                    row.items = JSON.parse(row.items);
                } catch (e) {
                    row.items = [];
                }
            }
            res.json(row);
        });
    });
});

app.delete('/api/purchases/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.run('DELETE FROM purchases WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting purchase:', err);
            return res.status(500).json({ error: 'Failed to delete purchase' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Purchase not found' });
        }

        res.json({ success: true, message: 'Purchase deleted successfully' });
    });
});

// Invoices endpoints
app.get('/api/invoices', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = 'SELECT * FROM invoices WHERE 1=1';
    const params = [];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching invoices:', err);
            return res.status(500).json({ error: 'Failed to fetch invoices' });
        }
        res.json(rows || []);
    });
});

app.get('/api/invoices/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM invoices WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching invoice:', err);
            return res.status(500).json({ error: 'Failed to fetch invoice' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json(row);
    });
});

app.get('/api/invoices/invoiceNo/:invoiceNo', (req, res) => {
    const db = getDatabase();
    const invoiceNo = req.params.invoiceNo;

    db.get('SELECT * FROM invoices WHERE invoiceNo = ?', [invoiceNo], (err, row) => {
        if (err) {
            console.error('Error fetching invoice by invoice number:', err);
            return res.status(500).json({ error: 'Failed to fetch invoice' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json(row);
    });
});

app.post('/api/invoices', (req, res) => {
    const db = getDatabase();
    const { invoiceNo, date, sale_id, customer_name, customer_address, customer_phone, customer_email, customer_taxId, subtotal, tax, total, status, paymentMethod, notes } = req.body;

    if (!invoiceNo || !date || !subtotal || !total) {
        return res.status(400).json({ error: 'Invoice number, date, subtotal, and total are required' });
    }

    const sql = `INSERT INTO invoices (invoiceNo, date, sale_id, customer_name, customer_address, customer_phone, customer_email, customer_taxId, subtotal, tax, total, status, paymentMethod, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [invoiceNo, date, sale_id || null, customer_name || null, customer_address || null, customer_phone || null, customer_email || null, customer_taxId || null, subtotal, tax || 0, total, status || 'Pending', paymentMethod || null, notes || null], function(err) {
        if (err) {
            console.error('Error creating invoice:', err);
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Invoice with this invoice number already exists' });
            }
            return res.status(500).json({ error: 'Failed to create invoice' });
        }

        db.get('SELECT * FROM invoices WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Invoice created but failed to fetch' });
            }
            res.status(201).json(row);
        });
    });
});

app.put('/api/invoices/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { invoiceNo, date, sale_id, customer_name, customer_address, customer_phone, customer_email, customer_taxId, subtotal, tax, total, status, paymentMethod, notes } = req.body;

    const sql = `UPDATE invoices 
                 SET invoiceNo = ?, date = ?, sale_id = ?, customer_name = ?, customer_address = ?, customer_phone = ?, customer_email = ?, customer_taxId = ?, subtotal = ?, tax = ?, total = ?, status = ?, paymentMethod = ?, notes = ?
                 WHERE id = ?`;

    db.run(sql, [invoiceNo, date, sale_id || null, customer_name || null, customer_address || null, customer_phone || null, customer_email || null, customer_taxId || null, subtotal, tax || 0, total, status || 'Pending', paymentMethod || null, notes || null, id], function(err) {
        if (err) {
            console.error('Error updating invoice:', err);
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Invoice with this invoice number already exists' });
            }
            return res.status(500).json({ error: 'Failed to update invoice' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        db.get('SELECT * FROM invoices WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Invoice updated but failed to fetch' });
            }
            res.json(row);
        });
    });
});

app.delete('/api/invoices/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.run('DELETE FROM invoices WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting invoice:', err);
            return res.status(500).json({ error: 'Failed to delete invoice' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json({ success: true, message: 'Invoice deleted successfully' });
    });
});

// Returns endpoints
app.get('/api/returns', (req, res) => {
    const db = getDatabase();
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status;
    const sale_id = req.query.sale_id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = 'SELECT * FROM returns WHERE 1=1';
    const params = [];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (sale_id) {
        query += ' AND sale_id = ?';
        params.push(parseInt(sale_id));
    }

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(query, params, async (err, rows) => {
        if (err) {
            console.error('Error fetching returns:', err);
            return res.status(500).json({ error: 'Failed to fetch returns' });
        }

        // Fetch return items for each return
        const returnsWithItems = await Promise.all((rows || []).map(async (returnRecord) => {
            return new Promise((resolve) => {
                db.all('SELECT * FROM return_items WHERE return_id = ?', [returnRecord.id], (err, items) => {
                    if (err) {
                        return resolve({ ...returnRecord, items: [] });
                    }
                    resolve({ ...returnRecord, items: items || [] });
                });
            });
        }));

        res.json(returnsWithItems);
    });
});

app.get('/api/returns/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT * FROM returns WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching return:', err);
            return res.status(500).json({ error: 'Failed to fetch return' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Return not found' });
        }

        // Fetch return items
        db.all('SELECT * FROM return_items WHERE return_id = ?', [id], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch return items' });
            }
            res.json({ ...row, items: items || [] });
        });
    });
});

app.get('/api/returns/returnNo/:returnNo', (req, res) => {
    const db = getDatabase();
    const returnNo = req.params.returnNo;

    db.get('SELECT * FROM returns WHERE returnNo = ?', [returnNo], (err, row) => {
        if (err) {
            console.error('Error fetching return by return number:', err);
            return res.status(500).json({ error: 'Failed to fetch return' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Return not found' });
        }

        // Fetch return items
        db.all('SELECT * FROM return_items WHERE return_id = ?', [row.id], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch return items' });
            }
            res.json({ ...row, items: items || [] });
        });
    });
});

app.post('/api/returns', (req, res) => {
    const db = getDatabase();
    const { returnNo, date, sale_id, customer_name, customer_phone, reason, refundAmount, refundMethod, status, processedBy, notes, items } = req.body;

    if (!returnNo || !date || !sale_id || !reason || refundAmount === undefined) {
        return res.status(400).json({ error: 'Return number, date, sale_id, reason, and refundAmount are required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'At least one item must be returned' });
    }

    db.serialize(() => {
        // Start transaction
        db.run('BEGIN TRANSACTION');

        // Insert return record
        const returnSql = `INSERT INTO returns (returnNo, date, sale_id, customer_name, customer_phone, reason, refundAmount, refundMethod, status, processedBy, notes)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(returnSql, [returnNo, date, sale_id, customer_name || null, customer_phone || null, reason, refundAmount, refundMethod || null, status || 'Pending', processedBy || null, notes || null], function(err) {
            if (err) {
                db.run('ROLLBACK');
                console.error('Error creating return:', err);
                if (err.message.includes('UNIQUE constraint')) {
                    return res.status(400).json({ error: 'Return with this return number already exists' });
                }
                return res.status(500).json({ error: 'Failed to create return' });
            }

            const returnId = this.lastID;

            // Insert return items and restore stock
            const itemSql = `INSERT INTO return_items (return_id, product_id, product_name, quantity, unit_price, subtotal, reason, restocked)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            let itemsProcessed = 0;
            let hasError = false;

            items.forEach((item) => {
                const { product_id, product_name, quantity, unit_price, subtotal, reason: itemReason, restock = true } = item;

                // Insert return item
                db.run(itemSql, [returnId, product_id || null, product_name, quantity, unit_price, subtotal, itemReason || null, restock ? 1 : 0], (err) => {
                    if (err) {
                        console.error('Error creating return item:', err);
                        hasError = true;
                        return;
                    }

                    // Restore stock if restock is true
                    if (restock && product_id) {
                        db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, product_id], (err) => {
                            if (err) {
                                console.error('Error restoring stock:', err);
                                // Don't fail the return, just log the error
                            }
                        });
                    }

                    itemsProcessed++;
                    if (itemsProcessed === items.length && !hasError) {
                        db.run('COMMIT', (err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ error: 'Failed to complete return' });
                            }

                            // Fetch the created return with items
                            db.get('SELECT * FROM returns WHERE id = ?', [returnId], (err, returnRecord) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Return created but failed to fetch' });
                                }

                                db.all('SELECT * FROM return_items WHERE return_id = ?', [returnId], (err, returnItems) => {
                                    if (err) {
                                        return res.status(500).json({ error: 'Return created but failed to fetch items' });
                                    }
                                    res.status(201).json({ ...returnRecord, items: returnItems || [] });
                                });
                            });
                        });
                    }
                });
            });
        });
    });
});

app.put('/api/returns/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const { returnNo, date, sale_id, customer_name, customer_phone, reason, refundAmount, refundMethod, status, processedBy, notes } = req.body;

    const sql = `UPDATE returns 
                 SET returnNo = ?, date = ?, sale_id = ?, customer_name = ?, customer_phone = ?, reason = ?, refundAmount = ?, refundMethod = ?, status = ?, processedBy = ?, notes = ?
                 WHERE id = ?`;

    db.run(sql, [returnNo, date, sale_id, customer_name || null, customer_phone || null, reason, refundAmount, refundMethod || null, status || 'Pending', processedBy || null, notes || null, id], function(err) {
        if (err) {
            console.error('Error updating return:', err);
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Return with this return number already exists' });
            }
            return res.status(500).json({ error: 'Failed to update return' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }

        db.get('SELECT * FROM returns WHERE id = ?', [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Return updated but failed to fetch' });
            }

            db.all('SELECT * FROM return_items WHERE return_id = ?', [id], (err, items) => {
                if (err) {
                    return res.status(500).json({ error: 'Return updated but failed to fetch items' });
                }
                res.json({ ...row, items: items || [] });
            });
        });
    });
});

app.delete('/api/returns/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    // First, get return items to restore stock (if needed)
    db.all('SELECT * FROM return_items WHERE return_id = ?', [id], (err, items) => {
        if (err) {
            console.error('Error fetching return items:', err);
            return res.status(500).json({ error: 'Failed to fetch return items' });
        }

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Restore stock (reverse the return)
            items.forEach((item) => {
                if (item.restocked && item.product_id) {
                    db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id], (err) => {
                        if (err) {
                            console.error('Error reversing stock:', err);
                        }
                    });
                }
            });

            // Delete return items (cascade will handle this, but explicit is better)
            db.run('DELETE FROM return_items WHERE return_id = ?', [id], (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    console.error('Error deleting return items:', err);
                    return res.status(500).json({ error: 'Failed to delete return items' });
                }

                // Delete return
                db.run('DELETE FROM returns WHERE id = ?', [id], function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        console.error('Error deleting return:', err);
                        return res.status(500).json({ error: 'Failed to delete return' });
                    }

                    if (this.changes === 0) {
                        db.run('ROLLBACK');
                        return res.status(404).json({ error: 'Return not found' });
                    }

                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return res.status(500).json({ error: 'Failed to complete deletion' });
                        }

                        res.json({ success: true, message: 'Return deleted successfully' });
                    });
                });
            });
        });
    });
});

// Get returns for a specific sale
app.get('/api/sales/:saleId/returns', (req, res) => {
    const db = getDatabase();
    const saleId = parseInt(req.params.saleId);

    db.all('SELECT * FROM returns WHERE sale_id = ? ORDER BY date DESC', [saleId], async (err, rows) => {
        if (err) {
            console.error('Error fetching returns for sale:', err);
            return res.status(500).json({ error: 'Failed to fetch returns' });
        }

        // Fetch return items for each return
        const returnsWithItems = await Promise.all((rows || []).map(async (returnRecord) => {
            return new Promise((resolve) => {
                db.all('SELECT * FROM return_items WHERE return_id = ?', [returnRecord.id], (err, items) => {
                    if (err) {
                        return resolve({ ...returnRecord, items: [] });
                    }
                    resolve({ ...returnRecord, items: items || [] });
                });
            });
        }));

        res.json(returnsWithItems);
    });
});

// Finance summary/statistics endpoint
app.get('/api/finance/summary', (req, res) => {
    const db = getDatabase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
        dateFilter = 'WHERE date >= ? AND date <= ?';
        params.push(startDate, endDate);
    } else if (startDate) {
        dateFilter = 'WHERE date >= ?';
        params.push(startDate);
    } else if (endDate) {
        dateFilter = 'WHERE date <= ?';
        params.push(endDate);
    }

    // Get total revenue (from sales)
    db.get(`SELECT COALESCE(SUM(total), 0) as totalRevenue, COALESCE(SUM(profit), 0) as totalProfit, COUNT(*) as salesCount FROM sales ${dateFilter}`, params, (err, salesData) => {
        if (err) {
            console.error('Error fetching sales summary:', err);
            return res.status(500).json({ error: 'Failed to fetch finance summary' });
        }

        // Get total expenses
        db.get(`SELECT COALESCE(SUM(amount), 0) as totalExpenses, COUNT(*) as expensesCount FROM expenses ${dateFilter}`, params, (err, expensesData) => {
            if (err) {
                console.error('Error fetching expenses summary:', err);
                return res.status(500).json({ error: 'Failed to fetch finance summary' });
            }

            // Get total purchases
            db.get(`SELECT COALESCE(SUM(total), 0) as totalPurchases, COALESCE(SUM(amountPaid), 0) as totalPaid, COUNT(*) as purchasesCount FROM purchases ${dateFilter}`, params, (err, purchasesData) => {
                if (err) {
                    console.error('Error fetching purchases summary:', err);
                    return res.status(500).json({ error: 'Failed to fetch finance summary' });
                }

                    // Get total invoices
                db.get(`SELECT COALESCE(SUM(total), 0) as totalInvoices, COUNT(*) as invoicesCount FROM invoices ${dateFilter}`, params, (err, invoicesData) => {
                    if (err) {
                        console.error('Error fetching invoices summary:', err);
                        return res.status(500).json({ error: 'Failed to fetch finance summary' });
                    }

                    // Get total returns/refunds
                    db.get(`SELECT COALESCE(SUM(refundAmount), 0) as totalReturns, COUNT(*) as returnsCount FROM returns ${dateFilter}`, params, (err, returnsData) => {
                        if (err) {
                            console.error('Error fetching returns summary:', err);
                            return res.status(500).json({ error: 'Failed to fetch finance summary' });
                        }

                        const netProfit = (salesData.totalProfit || 0) - (expensesData.totalExpenses || 0) - (returnsData.totalReturns || 0);
                        const outstandingPurchases = (purchasesData.totalPurchases || 0) - (purchasesData.totalPaid || 0);
                        const netRevenue = (salesData.totalRevenue || 0) - (returnsData.totalReturns || 0);

                        res.json({
                            revenue: {
                                total: salesData.totalRevenue || 0,
                                profit: salesData.totalProfit || 0,
                                count: salesData.salesCount || 0
                            },
                            returns: {
                                total: returnsData.totalReturns || 0,
                                count: returnsData.returnsCount || 0
                            },
                            expenses: {
                                total: expensesData.totalExpenses || 0,
                                count: expensesData.expensesCount || 0
                            },
                            purchases: {
                                total: purchasesData.totalPurchases || 0,
                                paid: purchasesData.totalPaid || 0,
                                outstanding: outstandingPurchases,
                                count: purchasesData.purchasesCount || 0
                            },
                            invoices: {
                                total: invoicesData.totalInvoices || 0,
                                count: invoicesData.invoicesCount || 0
                            },
                            netRevenue: netRevenue,
                            netProfit: netProfit,
                            dateRange: {
                                start: startDate || null,
                                end: endDate || null
                            }
                        });
                    });
                });
            });
        });
    });
});

// ============== ENTERPRISE FEATURES API ROUTES ==============

// ============== REAL-TIME STOCK TRACKING ==============

// Get stock movements
app.get('/api/stock/movements', (req, res) => {
    const db = getDatabase();
    const filters = {
        productId: req.query.productId ? parseInt(req.query.productId) : null,
        branchId: req.query.branchId ? parseInt(req.query.branchId) : null,
        movementType: req.query.movementType || null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
    };

    getStockMovements(db, filters)
        .then(movements => res.json(movements))
        .catch(err => {
            console.error('Error fetching stock movements:', err);
            res.status(500).json({ error: 'Failed to fetch stock movements' });
        });
});

// Get low stock alerts (real-time)
app.get('/api/stock/alerts', (req, res) => {
    const db = getDatabase();
    const branchId = req.query.branchId ? parseInt(req.query.branchId) : null;

    getLowStockAlerts(db, branchId)
        .then(alerts => res.json(alerts))
        .catch(err => {
            console.error('Error fetching stock alerts:', err);
            res.status(500).json({ error: 'Failed to fetch stock alerts' });
        });
});

// ============== MULTI-BRANCH SUPPORT ==============

// Get all branches
app.get('/api/branches', (req, res) => {
    const db = getDatabase();
    getBranches(db)
        .then(branches => res.json(branches))
        .catch(err => {
            console.error('Error fetching branches:', err);
            res.status(500).json({ error: 'Failed to fetch branches' });
        });
});

// Create new branch
app.post('/api/branches', (req, res) => {
    const db = getDatabase();
    const { name, code, address, phone, email, managerId } = req.body;

    if (!name || !code) {
        return res.status(400).json({ error: 'Branch name and code are required' });
    }

    createBranch(db, { name, code, address, phone, email, managerId })
        .then(branchId => {
            logActivity(db, null, 'BRANCH_CREATED', 'branch', branchId, `Branch ${name} (${code}) created`);
            res.status(201).json({ success: true, id: branchId, message: 'Branch created successfully' });
        })
        .catch(err => {
            console.error('Error creating branch:', err);
            if (err.message && err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Branch code already exists' });
            }
            res.status(500).json({ error: 'Failed to create branch' });
        });
});

// Get branch by ID
app.get('/api/branches/:id', (req, res) => {
    const db = getDatabase();
    const id = parseInt(req.params.id);

    db.get('SELECT b.*, u.name as manager_name FROM branches b LEFT JOIN users u ON b.manager_id = u.id WHERE b.id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching branch:', err);
            return res.status(500).json({ error: 'Failed to fetch branch' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        res.json(row);
    });
});

// ============== EMPLOYEE TIME TRACKING ==============

// Clock in
app.post('/api/employees/:id/clock-in', (req, res) => {
    const db = getDatabase();
    const userId = parseInt(req.params.id);
    const branchId = req.body.branchId ? parseInt(req.body.branchId) : null;

    clockIn(db, userId, branchId)
        .then(timeLogId => {
            logActivity(db, userId, 'CLOCK_IN', 'employee', userId, `Employee clocked in`);
            res.status(201).json({ success: true, id: timeLogId, message: 'Clocked in successfully' });
        })
        .catch(err => {
            console.error('Error clocking in:', err);
            res.status(400).json({ error: err.message || 'Failed to clock in' });
        });
});

// Clock out
app.post('/api/employees/:id/clock-out', (req, res) => {
    const db = getDatabase();
    const userId = parseInt(req.params.id);

    clockOut(db, userId)
        .then(() => {
            logActivity(db, userId, 'CLOCK_OUT', 'employee', userId, `Employee clocked out`);
            res.json({ success: true, message: 'Clocked out successfully' });
        })
        .catch(err => {
            console.error('Error clocking out:', err);
            res.status(400).json({ error: err.message || 'Failed to clock out' });
        });
});

// Get employee time logs
app.get('/api/employees/time-logs', (req, res) => {
    const db = getDatabase();
    const filters = {
        userId: req.query.userId ? parseInt(req.query.userId) : null,
        branchId: req.query.branchId ? parseInt(req.query.branchId) : null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
    };

    getEmployeeTimeLogs(db, filters)
        .then(logs => res.json(logs))
        .catch(err => {
            console.error('Error fetching time logs:', err);
            res.status(500).json({ error: 'Failed to fetch time logs' });
        });
});

// Get employee current status
app.get('/api/employees/:id/status', (req, res) => {
    const db = getDatabase();
    const userId = parseInt(req.params.id);

    db.get(
        `SELECT * FROM employee_time_logs 
         WHERE user_id = ? AND clock_out IS NULL
         ORDER BY clock_in DESC LIMIT 1`,
        [userId],
        (err, row) => {
            if (err) {
                console.error('Error fetching employee status:', err);
                return res.status(500).json({ error: 'Failed to fetch employee status' });
            }
            res.json({
                isClockedIn: !!row,
                currentSession: row || null
            });
        }
    );
});

// ============== ACCOUNTING LEDGER ==============

// Create ledger entry
app.post('/api/accounting/ledger', (req, res) => {
    const db = getDatabase();
    const { date, accountType, accountName, debit, credit, description, referenceType, referenceId, branchId, userId } = req.body;

    if (!date || !accountType || !accountName) {
        return res.status(400).json({ error: 'Date, account type, and account name are required' });
    }

    createLedgerEntry(db, { date, accountType, accountName, debit: debit || 0, credit: credit || 0, description, referenceType, referenceId, branchId, userId })
        .then(entryId => {
            logActivity(db, userId, 'LEDGER_ENTRY_CREATED', 'ledger', entryId, `Ledger entry created: ${accountName}`);
            res.status(201).json({ success: true, id: entryId, message: 'Ledger entry created successfully' });
        })
        .catch(err => {
            console.error('Error creating ledger entry:', err);
            res.status(400).json({ error: err.message || 'Failed to create ledger entry' });
        });
});

// Get ledger entries
app.get('/api/accounting/ledger', (req, res) => {
    const db = getDatabase();
    const filters = {
        accountType: req.query.accountType || null,
        accountName: req.query.accountName || null,
        branchId: req.query.branchId ? parseInt(req.query.branchId) : null,
        startDate: req.query.startDate || null,
        endDate: req.query.endDate || null,
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
    };

    getLedgerEntries(db, filters)
        .then(entries => res.json(entries))
        .catch(err => {
            console.error('Error fetching ledger entries:', err);
            res.status(500).json({ error: 'Failed to fetch ledger entries' });
        });
});

// Get account balance
app.get('/api/accounting/balance/:accountName', (req, res) => {
    const db = getDatabase();
    const accountName = req.params.accountName;
    const branchId = req.query.branchId ? parseInt(req.query.branchId) : null;
    const asOfDate = req.query.asOfDate || null;

    getAccountBalance(db, accountName, branchId, asOfDate)
        .then(balance => res.json(balance))
        .catch(err => {
            console.error('Error fetching account balance:', err);
            res.status(500).json({ error: 'Failed to fetch account balance' });
        });
});

// Get trial balance
app.get('/api/accounting/trial-balance', (req, res) => {
    const db = getDatabase();
    const branchId = req.query.branchId ? parseInt(req.query.branchId) : null;
    const asOfDate = req.query.asOfDate || null;

    getTrialBalance(db, branchId, asOfDate)
        .then(trialBalance => res.json(trialBalance))
        .catch(err => {
            console.error('Error fetching trial balance:', err);
            res.status(500).json({ error: 'Failed to fetch trial balance' });
        });
});

// ============== QUICKBOOKS INTEGRATION ==============

// Sync ledger entries to QuickBooks
app.post('/api/accounting/quickbooks/sync', async (req, res) => {
    const db = getDatabase();
    const { startDate, endDate, branchId } = req.body;

    try {
        const filters = {
            startDate: startDate || null,
            endDate: endDate || null,
            branchId: branchId ? parseInt(branchId) : null,
            limit: 1000
        };

        const entries = await getLedgerEntries(db, filters);
        const quickbooksEntries = entries.map(entry => formatForQuickBooks(entry));

        // In production, you would send this to QuickBooks API
        // For now, we return the formatted data
        res.json({
            success: true,
            message: 'Entries formatted for QuickBooks',
            entries: quickbooksEntries,
            count: quickbooksEntries.length,
            note: 'Configure QuickBooks API credentials to enable actual sync'
        });
    } catch (err) {
        console.error('Error syncing to QuickBooks:', err);
        res.status(500).json({ error: 'Failed to sync to QuickBooks' });
    }
});

// ============== ENHANCED SALES REPORTS ==============

// Get comprehensive sales report
app.get('/api/reports/sales', (req, res) => {
    const db = getDatabase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const branchId = req.query.branchId ? parseInt(req.query.branchId) : null;
    const cashierId = req.query.cashierId ? parseInt(req.query.cashierId) : null;

    let query = `
        SELECT 
            s.*,
            COUNT(DISTINCT si.id) as item_count
        FROM sales s
        LEFT JOIN sale_items si ON s.id = si.sale_id
        WHERE 1=1
    `;
    const params = [];

    if (startDate) {
        query += ' AND s.date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND s.date <= ?';
        params.push(endDate);
    }
    if (branchId) {
        query += ' AND s.branch_id = ?';
        params.push(branchId);
    }

    query += ' GROUP BY s.id ORDER BY s.date DESC, s.time DESC LIMIT 1000';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching sales report:', err);
            return res.status(500).json({ error: 'Failed to fetch sales report' });
        }

        // Calculate summary
        const summary = rows.reduce((acc, sale) => {
            acc.totalRevenue += parseFloat(sale.total || 0);
            acc.totalProfit += parseFloat(sale.profit || 0);
            acc.transactionCount += 1;
            acc.totalItems += parseFloat(sale.items || 0);
            return acc;
        }, { totalRevenue: 0, totalProfit: 0, transactionCount: 0, totalItems: 0 });

        res.json({
            summary,
            sales: rows,
            dateRange: { start: startDate, end: endDate }
        });
    });
});

// Export sales report to CSV
app.get('/api/reports/sales/export', (req, res) => {
    const db = getDatabase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const branchId = req.query.branchId ? parseInt(req.query.branchId) : null;

    let query = 'SELECT * FROM sales WHERE 1=1';
    const params = [];

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }
    if (branchId) {
        query += ' AND branch_id = ?';
        params.push(branchId);
    }

    query += ' ORDER BY date DESC, time DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error exporting sales:', err);
            return res.status(500).json({ error: 'Failed to export sales' });
        }

        // Convert to CSV
        const headers = ['ID', 'Date', 'Time', 'Items', 'Total', 'Profit', 'Payment Method', 'Cashier', 'Branch'];
        const csv = [
            headers.join(','),
            ...rows.map(row => [
                row.id,
                row.date,
                row.time,
                row.items,
                row.total,
                row.profit,
                row.paymentMethod || '',
                row.cashier || '',
                row.branch_id || ''
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=sales-report-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    });
});

// ============== API ROUTES ==============

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: '43_Industries POS',
        mpesa: MPESA_CONFIG.environment,
        timestamp: new Date().toISOString()
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
            : 'M-Pesa credentials not configured. Please update .env file.'
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
                message: 'DEMO MODE: STK Push simulated. Configure .env for real payments.',
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

// Serve the POS system
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'complete-system.html'));
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await closeDatabase();
    process.exit(0);
});

// Initialize database and start server
initDatabase()
    .then(() => {
        // Start server after database is initialized
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           43_INDUSTRIES POS SYSTEM                         ║
║           Server Running on Port ${PORT}                       ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║   🌐 Open in browser: http://localhost:${PORT}                ║
║                                                            ║
║   📦 Item Integration: ENABLED ✅                           ║
║   💾 Database: CONNECTED ✅                                 ║
║   📱 M-Pesa Status: ${MPESA_CONFIG.consumerKey === 'YOUR_CONSUMER_KEY' ? 'DEMO MODE (Configure .env)' : 'CONFIGURED ✅'}
║   🔧 Environment: ${MPESA_CONFIG.environment.toUpperCase()}                              
║                                                            ║
╚════════════════════════════════════════════════════════════╝
            `);
            
            console.log(`
📦 ITEM INTEGRATION ENDPOINTS:
   GET    /api/products                    - Get all products
   GET    /api/products/:id                - Get product by ID
   GET    /api/products/barcode/:barcode   - Get product by barcode
   POST   /api/products                    - Create product
   PUT    /api/products/:id                - Update product
   DELETE /api/products/:id                - Delete product
   POST   /api/products/bulk-import        - Bulk import items (JSON array)
   POST   /api/products/integrate-external - Integrate from external API

💰 FINANCE ENDPOINTS:
   GET    /api/expenses                    - Get all expenses
   GET    /api/expenses/:id                - Get expense by ID
   POST   /api/expenses                    - Create expense
   PUT    /api/expenses/:id                - Update expense
   DELETE /api/expenses/:id                - Delete expense
   GET    /api/purchases                   - Get all purchases
   GET    /api/purchases/:id               - Get purchase by ID
   POST   /api/purchases                   - Create purchase
   PUT    /api/purchases/:id               - Update purchase
   DELETE /api/purchases/:id               - Delete purchase
   GET    /api/invoices                    - Get all invoices
   GET    /api/invoices/:id                - Get invoice by ID
   GET    /api/invoices/invoiceNo/:invoiceNo - Get invoice by number
   POST   /api/invoices                    - Create invoice
   PUT    /api/invoices/:id                - Update invoice
   DELETE /api/invoices/:id                - Delete invoice
   GET    /api/returns                     - Get all returns
   GET    /api/returns/:id                 - Get return by ID
   GET    /api/returns/returnNo/:returnNo  - Get return by return number
   GET    /api/sales/:saleId/returns       - Get returns for a sale
   POST   /api/returns                     - Create return (with auto stock restore)
   PUT    /api/returns/:id                 - Update return
   DELETE /api/returns/:id                 - Delete return (with stock reversal)
   GET    /api/finance/summary             - Get finance summary/statistics

👥 USER MANAGEMENT & AUTHENTICATION:
   POST   /api/auth/login                  - User login
   POST   /api/auth/verify-pin             - Verify PIN for sensitive operations
   GET    /api/users                       - Get all users
   GET    /api/users/:id                   - Get user by ID
   PUT    /api/users/:id                   - Update user (password, PIN, etc.)
   GET    /api/activity-logs               - Get activity logs
   GET    /api/admin/notifications         - Get admin notifications
   PUT    /api/admin/notifications/:id/read - Mark notification as read
   PUT    /api/admin/notifications/read-all - Mark all as read
   POST   /api/sales/:id/void              - Void sale (requires PIN)

📋 Default Users:
   Admin:    admin / admin123
   Cashier:  samuel / samuel123
   Cashier:  michael / michael123
            `);
            
            if (MPESA_CONFIG.consumerKey === 'YOUR_CONSUMER_KEY') {
                console.log(`
⚠️  M-PESA NOT CONFIGURED
   
   To enable real M-Pesa payments:
   1. Register at https://developer.safaricom.co.ke
   2. Create an app and get credentials
   3. Copy .env.example to .env
   4. Fill in your credentials
   5. Restart the server
   
   For now, the system will run in DEMO mode.
`);
            }
        });
    })
    .catch(err => {
        console.error('❌ Failed to initialize database:', err);
        console.error('Please ensure sqlite3 is installed: npm install sqlite3');
        process.exit(1);
    });

module.exports = app;
