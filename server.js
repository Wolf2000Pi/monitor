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
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/status') {
    const status = await checkAllServices();
    res.end(JSON.stringify(status));
  } else if (req.url === '/api/config') {
    res.end(JSON.stringify({
      title: config.title || 'Service Monitor',
      logo: config.logo,
      refreshInterval: config.refreshInterval,
      services: config.services.map(s => ({ name: s.name, url: s.url, logo: s.logo }))
    }));
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
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
