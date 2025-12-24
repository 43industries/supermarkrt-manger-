// Automatic Database Backup System
const fs = require('fs');
const path = require('path');
const { getDatabase } = require('./database');

const BACKUP_DIR = path.join(__dirname, 'backups');
const DB_PATH = path.join(__dirname, 'supermarket.db');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Create backup function
function createBackup() {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const backupPath = path.join(BACKUP_DIR, `supermarket-backup-${timestamp}.db`);
      
      // Use vacuum into for efficient backup
      const db = getDatabase();
      db.run(`VACUUM INTO '${backupPath.replace(/\\/g, '/')}'`, (err) => {
        if (err) {
          console.error('❌ Backup failed:', err);
          reject(err);
        } else {
          console.log(`✅ Backup created: ${path.basename(backupPath)}`);
          
          // Cleanup old backups (keep last 10)
          cleanupOldBackups();
          resolve(backupPath);
        }
      });
    } catch (error) {
      console.error('❌ Backup error:', error);
      reject(error);
    }
  });
}

// Cleanup old backups (keep last 10)
function cleanupOldBackups() {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('supermarket-backup-') && f.endsWith('.db'))
      .map(f => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
        time: fs.statSync(path.join(BACKUP_DIR, f)).mtime
      }))
      .sort((a, b) => b.time - a.time);
    
    // Keep only last 10 backups
    if (backups.length > 10) {
      const toDelete = backups.slice(10);
      toDelete.forEach(backup => {
        try {
          fs.unlinkSync(backup.path);
          console.log(`🗑️  Deleted old backup: ${backup.name}`);
        } catch (err) {
          console.error(`Failed to delete backup ${backup.name}:`, err);
        }
      });
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}

// Schedule automatic backups
function startAutoBackup(intervalHours = 6) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  
  // Create initial backup
  createBackup().catch(err => {
    console.error('Initial backup failed:', err);
  });
  
  // Schedule periodic backups
  setInterval(() => {
    createBackup().catch(err => {
      console.error('Scheduled backup failed:', err);
    });
  }, intervalMs);
  
  console.log(`📦 Auto-backup enabled (every ${intervalHours} hours)`);
}

// Manual backup on demand
function manualBackup() {
  return createBackup();
}

module.exports = {
  createBackup,
  startAutoBackup,
  manualBackup,
  cleanupOldBackups
};

