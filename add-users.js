/**
 * Add default users to the database
 * Run this script if users table is empty or passwords don't work
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, 'supermarket.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to database');
  
  // Check if users exist
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) {
      console.error('❌ Error checking users:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (row.count > 0) {
      console.log(`⚠️  Found ${row.count} existing users in database`);
      console.log('Do you want to add default users anyway? (This will skip if username exists)');
      console.log('Running anyway...\n');
    }
    
    // Add default users (or update if they exist)
    const defaultUsers = [
      { username: 'admin', password: 'admin123', name: 'Admin', role: 'Admin' },
      { username: 'samuel', password: 'samuel123', name: 'Samuel', role: 'Cashier' },
      { username: 'michael', password: 'michael123', name: 'Michael', role: 'Cashier' }
    ];
    
    let processed = 0;
    const total = defaultUsers.length;
    
    defaultUsers.forEach(user => {
      // First check if user exists
      db.get('SELECT id FROM users WHERE username = ?', [user.username], (err, existing) => {
        if (err) {
          console.error(`❌ Error checking user ${user.username}:`, err.message);
          processed++;
          if (processed === total) {
            db.close();
            process.exit(1);
          }
          return;
        }
        
        if (existing) {
          // User exists, update password
          db.run(
            'UPDATE users SET password = ?, name = ?, role = ?, active = 1 WHERE username = ?',
            [user.password, user.name, user.role, user.username],
            function(err) {
              if (err) {
                console.error(`❌ Error updating user ${user.username}:`, err.message);
              } else {
                console.log(`✅ Updated user: ${user.username} (password: ${user.password})`);
              }
              processed++;
              if (processed === total) {
                finish();
              }
            }
          );
        } else {
          // User doesn't exist, insert
          db.run(
            'INSERT INTO users (username, password, name, role, active) VALUES (?, ?, ?, ?, 1)',
            [user.username, user.password, user.name, user.role],
            function(err) {
              if (err) {
                console.error(`❌ Error adding user ${user.username}:`, err.message);
              } else {
                console.log(`✅ Added user: ${user.username} (password: ${user.password})`);
              }
              processed++;
              if (processed === total) {
                finish();
              }
            }
          );
        }
      });
    });
    
    function finish() {
      console.log('\n✅ Done! Default users have been added/updated.');
      console.log('\n📋 Default Login Credentials:');
      console.log('   Admin:    admin / admin123');
      console.log('   Samuel:   samuel / samuel123');
      console.log('   Michael:  michael / michael123');
      console.log('\n🎉 You can now login with these credentials!');
      db.close();
    }
  });
});
