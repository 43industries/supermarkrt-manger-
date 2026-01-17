/**
 * Clear Sample Data Script
 * This script clears all sample/demo data from the database
 * so you can start fresh with your real shop data
 * 
 * Usage: node clear-sample-data.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, 'supermarket.db');

console.log('\n⚠️  WARNING: This will delete ALL data except users!');
console.log('   This includes: Products, Sales, Customers, Suppliers, Expenses, Purchases, Invoices, Returns\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database');
    clearSampleData();
});

function clearSampleData() {
    console.log('\n🗑️  Clearing sample data...\n');
    
    let completed = 0;
    const totalOps = 12;
    
    const checkComplete = () => {
        completed++;
        if (completed >= totalOps) {
            // Check users - keep them
            db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
                if (err) {
                    console.error('Error checking users:', err);
                } else {
                    console.log(`✅ Kept ${row.count} user(s) (users are not deleted)`);
                }
                
                console.log('\n✅ Sample data cleared successfully!');
                console.log('\n📝 Next steps:');
                console.log('   1. Fix your system date/time (if wrong)');
                console.log('   2. Start the server: npm start');
                console.log('   3. Login as admin');
                console.log('   4. Add your real products');
                console.log('   5. Add your real customers (optional)');
                console.log('   6. Add your real suppliers (optional)');
                console.log('   7. Start making real sales!');
                console.log('\n🎉 Your system is now ready for real shop data!\n');
                
                db.close();
            });
        }
    };
    
    // Clear in order to respect foreign keys
    db.run('DELETE FROM return_items', (err) => {
        if (err) console.error('❌ Error clearing return_items:', err);
        else console.log('✅ Cleared return items');
        checkComplete();
    });
    
    db.run('DELETE FROM returns', (err) => {
        if (err) console.error('❌ Error clearing returns:', err);
        else console.log('✅ Cleared returns');
        checkComplete();
    });
    
    db.run('DELETE FROM invoices', (err) => {
        if (err) console.error('❌ Error clearing invoices:', err);
        else console.log('✅ Cleared invoices');
        checkComplete();
    });
    
    db.run('DELETE FROM sale_items', (err) => {
        if (err) console.error('❌ Error clearing sale_items:', err);
        else console.log('✅ Cleared sale items');
        checkComplete();
    });
    
    db.run('DELETE FROM sales', (err) => {
        if (err) console.error('❌ Error clearing sales:', err);
        else console.log('✅ Cleared sales');
        checkComplete();
    });
    
    db.run('DELETE FROM purchases', (err) => {
        if (err) console.error('❌ Error clearing purchases:', err);
        else console.log('✅ Cleared purchases');
        checkComplete();
    });
    
    db.run('DELETE FROM expenses', (err) => {
        if (err) console.error('❌ Error clearing expenses:', err);
        else console.log('✅ Cleared expenses');
        checkComplete();
    });
    
    db.run('DELETE FROM customers', (err) => {
        if (err) console.error('❌ Error clearing customers:', err);
        else console.log('✅ Cleared customers');
        checkComplete();
    });
    
    db.run('DELETE FROM suppliers', (err) => {
        if (err) console.error('❌ Error clearing suppliers:', err);
        else console.log('✅ Cleared suppliers');
        checkComplete();
    });
    
    db.run('DELETE FROM products', (err) => {
        if (err) console.error('❌ Error clearing products:', err);
        else console.log('✅ Cleared products');
        checkComplete();
    });
    
    db.run('DELETE FROM activity_logs', (err) => {
        if (err) {
            // Table might not exist, that's okay
            console.log('ℹ️  Activity logs table (not found or empty)');
        } else {
            console.log('✅ Cleared activity logs');
        }
        checkComplete();
    });
    
    db.run('DELETE FROM admin_notifications', (err) => {
        if (err) {
            // Table might not exist, that's okay
            console.log('ℹ️  Admin notifications table (not found or empty)');
        } else {
            console.log('✅ Cleared admin notifications');
        }
        checkComplete();
    });
}
