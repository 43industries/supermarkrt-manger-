/**
 * Change user password in the database
 * Usage: node change-password.js <username> <newpassword>
 * Example: node change-password.js admin mynewpassword123
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, 'supermarket.db');

// Get arguments
const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.log('❌ Usage: node change-password.js <username> <newpassword>');
  console.log('   Example: node change-password.js admin mynewpassword123');
  console.log('   Example: node change-password.js samuel newsamuel123');
  console.log('   Example: node change-password.js michael newmichael123');
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to database');
  
  // Check if user exists
  db.get('SELECT id, username, name, role FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('❌ Error checking user:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (!user) {
      console.log(`❌ User "${username}" not found in database`);
      console.log('\nAvailable users:');
      db.all('SELECT username, name, role FROM users', (err, users) => {
        if (!err && users) {
          users.forEach(u => console.log(`   - ${u.username} (${u.name}) - ${u.role}`));
        }
        db.close();
        process.exit(1);
      });
      return;
    }
    
    // Update password
    db.run(
      'UPDATE users SET password = ? WHERE username = ?',
      [newPassword, username],
      function(err) {
        if (err) {
          console.error('❌ Error updating password:', err.message);
          db.close();
          process.exit(1);
        }
        
        if (this.changes === 0) {
          console.log(`❌ No changes made. User "${username}" not found.`);
          db.close();
          process.exit(1);
        }
        
        console.log(`\n✅ Password changed successfully!`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   New Password: ${newPassword}`);
        console.log(`\n🎉 You can now login with:`);
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${newPassword}`);
        
        db.close();
      }
    );
  });
});
