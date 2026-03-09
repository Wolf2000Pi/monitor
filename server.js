const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const PORT = process.env.PORT || 3000;

function checkAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;
  
  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, 'base64').toString();
  const [username, password] = decoded.split(':');
  
  return username === config.username && password === config.password;
}

function requireAuth(req, res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="Monitor"',
    'Content-Type': 'text/html'
  });
  res.end('<html><body><h1>401 Unauthorized</h1></body></html>');
}

function checkService(service) {
  return new Promise((resolve) => {
    const start = Date.now();
    const isHttps = service.url.startsWith('https');
    const protocol = isHttps ? https : http;
    
    const options = { 
      timeout: 10000,
      rejectUnauthorized: false,
      family: 4,
      headers: { 'User-Agent': 'Monitor/1.0' }
    };
    
    const req = protocol.get(service.url, options, (res) => {
      const responseTime = Date.now() - start;
      resolve({
        name: service.name,
        url: service.url,
        logo: service.logo,
        status: res.statusCode >= 200 && res.statusCode < 600 ? 'online' : 'offline',
        statusCode: res.statusCode,
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      });
    });
    
    req.on('error', (err) => {
      console.error(`Error checking ${service.name}:`, err.code);
      resolve({
        name: service.name,
        url: service.url,
        logo: service.logo,
        status: 'offline',
        statusCode: 0,
        error: err.code || err.message,
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString()
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: service.name,
        url: service.url,
        logo: service.logo,
        status: 'offline',
        statusCode: 0,
        error: 'timeout',
        responseTime: config.timeout,
        timestamp: new Date().toISOString()
      });
    });
  });
}

async function checkAllServices() {
  const results = await Promise.all(config.services.map(service => checkService(service)));
  return results;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const needsAuth = config.username && config.password;
  
  if (needsAuth && !checkAuth(req)) {
    if (req.url.startsWith('/settings') || 
        req.url.startsWith('/api/config') ||
        req.url === '/' || 
        req.url === '/index.html' ||
        req.url === '/api/status') {
      return requireAuth(req, res);
    }
  }
  
  if (req.url === '/api/status') {
    const status = await checkAllServices();
    res.end(JSON.stringify(status));
    } else if (req.url === '/api/config') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const newConfig = JSON.parse(body);
          if (!newConfig.password) {
            newConfig.password = config.password;
          }
          if (!newConfig.username) {
            newConfig.username = config.username;
          }
          fs.writeFileSync('config.json', JSON.stringify(newConfig, null, 2));
          Object.assign(config, newConfig);
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else {
      res.end(JSON.stringify({
        title: config.title || 'Service Monitor',
        logo: config.logo,
        refreshInterval: config.refreshInterval,
        timeout: config.timeout,
        hasAuth: !!(config.username && config.password),
        services: config.services.map(s => ({ name: s.name, url: s.url, logo: s.logo }))
      }));
    }
  } else if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/settings' || req.url === '/settings.html') {
    fs.readFile(path.join(__dirname, 'public', 'settings.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading settings.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/api/images') {
    const imagesDir = path.join(__dirname, 'assets', 'img');
    let images = [];
    try {
      if (fs.existsSync(imagesDir)) {
        images = fs.readdirSync(imagesDir).filter(f => 
          ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'].includes(path.extname(f).toLowerCase())
        );
      }
    } catch (e) {}
    res.end(JSON.stringify(images.map(f => '/assets/img/' + f)));
  } else if (req.url.startsWith('/assets/')) {
    const filePath = path.join(__dirname, req.url);
    const ext = path.extname(filePath);
    const contentTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml'
    };
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
