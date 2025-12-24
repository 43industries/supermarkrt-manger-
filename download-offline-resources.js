// Script to download all CDN resources for offline use
const https = require('https');
const fs = require('fs');
const path = require('path');

const libsDir = path.join(__dirname, 'libs');
if (!fs.existsSync(libsDir)) {
  fs.mkdirSync(libsDir, { recursive: true });
}

const resources = [
  {
    url: 'https://unpkg.com/react@18/umd/react.production.min.js',
    filename: 'react.production.min.js'
  },
  {
    url: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    filename: 'react-dom.production.min.js'
  },
  {
    url: 'https://unpkg.com/@babel/standalone/babel.min.js',
    filename: 'babel.min.js'
  },
  {
    url: 'https://cdn.tailwindcss.com',
    filename: 'tailwindcss.min.js'
  }
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('📦 Downloading offline resources...\n');
  
  for (const resource of resources) {
    const filepath = path.join(libsDir, resource.filename);
    try {
      await downloadFile(resource.url, filepath);
    } catch (error) {
      console.error(`❌ Error downloading ${resource.filename}:`, error.message);
      console.error('⚠️  You may need internet connection for initial setup');
    }
  }
  
  console.log('\n✅ Offline resources download complete!');
  console.log(`📁 Files saved in: ${libsDir}`);
  console.log('\n🎉 Your system is now ready for offline use!');
}

downloadAll().catch(console.error);

