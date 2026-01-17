/**
 * Enterprise Features Module
 * Real-time Stock Tracking, Multi-Branch Support, Employee Management, Accounting
 */

const { getDatabase } = require('./database');

// ============== REAL-TIME STOCK TRACKING ==============

/**
 * Log stock movement for real-time tracking
 */
function logStockMovement(db, productId, branchId, movementType, quantity, previousStock, newStock, referenceType, referenceId, userId, notes = null) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO stock_movements (product_id, branch_id, movement_type, quantity, previous_stock, new_stock, reference_type, reference_id, user_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, branchId, movementType, quantity, previousStock, newStock, referenceType, referenceId, userId, notes],
      function(err) {
        if (err) {
          console.error('Error logging stock movement:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

/**
 * Get stock movement history
 */
function getStockMovements(db, filters = {}) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT sm.*, p.name as product_name, b.name as branch_name, u.name as user_name
      FROM stock_movements sm
      LEFT JOIN products p ON sm.product_id = p.id
      LEFT JOIN branches b ON sm.branch_id = b.id
      LEFT JOIN users u ON sm.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.productId) {
      query += ' AND sm.product_id = ?';
      params.push(filters.productId);
    }
    if (filters.branchId) {
      query += ' AND sm.branch_id = ?';
      params.push(filters.branchId);
    }
    if (filters.movementType) {
      query += ' AND sm.movement_type = ?';
      params.push(filters.movementType);
    }
    if (filters.startDate) {
      query += ' AND sm.created_at >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND sm.created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY sm.created_at DESC LIMIT ? OFFSET ?';
    params.push(filters.limit || 100, filters.offset || 0);

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get low stock alerts (real-time)
 */
function getLowStockAlerts(db, branchId = null) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT p.*, 
             (p.stock - p.reorderLevel) as stock_deficit,
             CASE 
               WHEN p.stock = 0 THEN 'CRITICAL'
               WHEN p.stock <= p.reorderLevel THEN 'LOW'
               WHEN p.stock <= p.reorderLevel * 1.5 THEN 'WARNING'
               ELSE 'OK'
             END as alert_level
      FROM products p
      WHERE p.stock <= p.reorderLevel * 1.5
    `;
    const params = [];

    if (branchId) {
      query += ' AND p.branch_id = ?';
      params.push(branchId);
    }

    query += ' ORDER BY p.stock ASC, p.reorderLevel DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ============== MULTI-BRANCH SUPPORT ==============

/**
 * Create a new branch
 */
function createBranch(db, branchData) {
  return new Promise((resolve, reject) => {
    const { name, code, address, phone, email, managerId } = branchData;
    
    db.run(
      `INSERT INTO branches (name, code, address, phone, email, manager_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, code, address || null, phone || null, email || null, managerId || null],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

/**
 * Get all branches
 */
function getBranches(db) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT b.*, u.name as manager_name
       FROM branches b
       LEFT JOIN users u ON b.manager_id = u.id
       ORDER BY b.name`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// ============== EMPLOYEE TIME TRACKING ==============

/**
 * Clock in employee
 */
function clockIn(db, userId, branchId) {
  return new Promise((resolve, reject) => {
    // Check if employee is already clocked in
    db.get(
      `SELECT * FROM employee_time_logs 
       WHERE user_id = ? AND clock_out IS NULL
       ORDER BY clock_in DESC LIMIT 1`,
      [userId],
      (err, existing) => {
        if (err) {
          reject(err);
          return;
        }

        if (existing) {
          reject(new Error('Employee is already clocked in'));
          return;
        }

        db.run(
          `INSERT INTO employee_time_logs (user_id, branch_id, clock_in)
           VALUES (?, ?, CURRENT_TIMESTAMP)`,
          [userId, branchId],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      }
    );
  });
}

/**
 * Clock out employee
 */
function clockOut(db, userId) {
  return new Promise((resolve, reject) => {
    // Find active time log
    db.get(
      `SELECT * FROM employee_time_logs 
       WHERE user_id = ? AND clock_out IS NULL
       ORDER BY clock_in DESC LIMIT 1`,
      [userId],
      (err, timeLog) => {
        if (err) {
          reject(err);
          return;
        }

        if (!timeLog) {
          reject(new Error('No active clock-in found'));
          return;
        }

        const clockInTime = new Date(timeLog.clock_in);
        const clockOutTime = new Date();
        const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60); // Convert to hours

        db.run(
          `UPDATE employee_time_logs 
           SET clock_out = CURRENT_TIMESTAMP, total_hours = ?
           WHERE id = ?`,
          [totalHours, timeLog.id],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.changes);
            }
          }
        );
      }
    );
  });
}

/**
 * Get employee time logs
 */
function getEmployeeTimeLogs(db, filters = {}) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT etl.*, u.name as employee_name, b.name as branch_name
      FROM employee_time_logs etl
      LEFT JOIN users u ON etl.user_id = u.id
      LEFT JOIN branches b ON etl.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.userId) {
      query += ' AND etl.user_id = ?';
      params.push(filters.userId);
    }
    if (filters.branchId) {
      query += ' AND etl.branch_id = ?';
      params.push(filters.branchId);
    }
    if (filters.startDate) {
      query += ' AND DATE(etl.clock_in) >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND DATE(etl.clock_in) <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY etl.clock_in DESC LIMIT ? OFFSET ?';
    params.push(filters.limit || 100, filters.offset || 0);

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ============== ACCOUNTING LEDGER ==============

/**
 * Create ledger entry (double-entry bookkeeping)
 */
function createLedgerEntry(db, entryData) {
  return new Promise((resolve, reject) => {
    const { date, accountType, accountName, debit, credit, description, referenceType, referenceId, branchId, userId } = entryData;

    // Validate: debit and credit cannot both be zero or both be non-zero
    if ((debit === 0 && credit === 0) || (debit > 0 && credit > 0)) {
      reject(new Error('Invalid ledger entry: must have either debit or credit, not both'));
      return;
    }

    db.run(
      `INSERT INTO ledger_entries (date, account_type, account_name, debit, credit, description, reference_type, reference_id, branch_id, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, accountType, accountName, debit || 0, credit || 0, description || null, referenceType || null, referenceId || null, branchId || null, userId || null],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

/**
 * Get ledger entries
 */
function getLedgerEntries(db, filters = {}) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT le.*, b.name as branch_name, u.name as user_name
      FROM ledger_entries le
      LEFT JOIN branches b ON le.branch_id = b.id
      LEFT JOIN users u ON le.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.accountType) {
      query += ' AND le.account_type = ?';
      params.push(filters.accountType);
    }
    if (filters.accountName) {
      query += ' AND le.account_name = ?';
      params.push(filters.accountName);
    }
    if (filters.branchId) {
      query += ' AND le.branch_id = ?';
      params.push(filters.branchId);
    }
    if (filters.startDate) {
      query += ' AND le.date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND le.date <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY le.date DESC, le.created_at DESC LIMIT ? OFFSET ?';
    params.push(filters.limit || 100, filters.offset || 0);

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get account balance
 */
function getAccountBalance(db, accountName, branchId = null, asOfDate = null) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        SUM(debit) as total_debit,
        SUM(credit) as total_credit,
        (SUM(debit) - SUM(credit)) as balance
      FROM ledger_entries
      WHERE account_name = ?
    `;
    const params = [accountName];

    if (branchId) {
      query += ' AND branch_id = ?';
      params.push(branchId);
    }
    if (asOfDate) {
      query += ' AND date <= ?';
      params.push(asOfDate);
    }

    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          accountName,
          totalDebit: row.total_debit || 0,
          totalCredit: row.total_credit || 0,
          balance: row.balance || 0
        });
      }
    });
  });
}

/**
 * Get trial balance
 */
function getTrialBalance(db, branchId = null, asOfDate = null) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        account_type,
        account_name,
        SUM(debit) as total_debit,
        SUM(credit) as total_credit,
        (SUM(debit) - SUM(credit)) as balance
      FROM ledger_entries
      WHERE 1=1
    `;
    const params = [];

    if (branchId) {
      query += ' AND branch_id = ?';
      params.push(branchId);
    }
    if (asOfDate) {
      query += ' AND date <= ?';
      params.push(asOfDate);
    }

    query += ' GROUP BY account_type, account_name ORDER BY account_type, account_name';

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const summary = rows.reduce((acc, row) => {
          acc.totalDebit += row.total_debit || 0;
          acc.totalCredit += row.total_credit || 0;
          return acc;
        }, { totalDebit: 0, totalCredit: 0 });

        resolve({
          accounts: rows,
          summary: {
            ...summary,
            difference: summary.totalDebit - summary.totalCredit
          }
        });
      }
    });
  });
}

// ============== QUICKBOOKS INTEGRATION HELPERS ==============

/**
 * Format ledger entry for QuickBooks API
 */
function formatForQuickBooks(ledgerEntry) {
  return {
    Line: [
      {
        Amount: ledgerEntry.debit || ledgerEntry.credit,
        DetailType: ledgerEntry.debit > 0 ? 'Debit' : 'Credit',
        AccountRef: {
          value: getQuickBooksAccountCode(ledgerEntry.accountType, ledgerEntry.accountName)
        }
      }
    ],
    TxnDate: ledgerEntry.date,
    DocNumber: `GL-${ledgerEntry.id}`,
    PrivateNote: ledgerEntry.description
  };
}

/**
 * Map account to QuickBooks account code
 */
function getQuickBooksAccountCode(accountType, accountName) {
  const accountMap = {
    'Revenue': '4000',
    'Cost of Goods Sold': '5000',
    'Expenses': '6000',
    'Assets': '1000',
    'Liabilities': '2000',
    'Equity': '3000'
  };
  return accountMap[accountType] || '4000';
}

module.exports = {
  // Stock Tracking
  logStockMovement,
  getStockMovements,
  getLowStockAlerts,
  
  // Multi-Branch
  createBranch,
  getBranches,
  
  // Employee Time Tracking
  clockIn,
  clockOut,
  getEmployeeTimeLogs,
  
  // Accounting
  createLedgerEntry,
  getLedgerEntries,
  getAccountBalance,
  getTrialBalance,
  
  // QuickBooks
  formatForQuickBooks,
  getQuickBooksAccountCode
};
