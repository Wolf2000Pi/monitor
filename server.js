const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const PORT = process.env.PORT || 3000;

function checkService(service) {
  return new Promise((resolve) => {
    const start = Date.now();
    const protocol = service.url.startsWith('https') ? https : http;
    
    const req = protocol.get(service.url, { timeout: config.timeout }, (res) => {
      const responseTime = Date.now() - start;
      resolve({
        name: service.name,
        url: service.url,
        logo: service.logo,
        status: res.statusCode >= 200 && res.statusCode < 400 ? 'online' : 'offline',
        statusCode: res.statusCode,
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      });
    });
    
    req.on('error', () => {
      resolve({
        name: service.name,
        url: service.url,
        logo: service.logo,
        status: 'offline',
        statusCode: 0,
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
