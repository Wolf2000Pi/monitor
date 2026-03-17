const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const PORT = process.env.PORT || 3000;

const rateLimitMap = new Map();
const failBanMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;
const FAIL_BAN_MAX = 5;
const FAIL_BAN_DURATION = 15 * 60 * 1000;

function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  
  if (failBanMap.has(ip) && now < failBanMap.get(ip).until) {
    return { allowed: false, reason: 'banned', until: failBanMap.get(ip).until };
  }
  
  if (failBanMap.has(ip) && now >= failBanMap.get(ip).until) {
    failBanMap.delete(ip);
  }
  
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    record.count++;
  }
  
  rateLimitMap.set(ip, record);
  
  if (record.count > RATE_LIMIT_MAX) {
    return { allowed: false, reason: 'rate_limit' };
  }
  
  return { allowed: true };
}

function recordFailedLogin(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = failBanMap.get(ip) || { count: 0, until: 0 };
  
  record.count++;
  
  if (record.count >= FAIL_BAN_MAX) {
    record.until = now + FAIL_BAN_DURATION;
    console.log(`IP ${ip} wurde für ${FAIL_BAN_DURATION / 60000} Minuten gebannt`);
  }
  
  failBanMap.set(ip, record);
}

function clearFailedLogin(req) {
  const ip = getClientIp(req);
  failBanMap.delete(ip);
  rateLimitMap.delete(ip);
}

function checkAuth(req) {
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    return { valid: false, rateLimited: true, reason: rateLimit.reason };
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return { valid: false, rateLimited: false };
  }
  
  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, 'base64').toString();
  const [username, password] = decoded.split(':');
  
  if (username === config.username && password === config.password) {
    clearFailedLogin(req);
    return { valid: true, rateLimited: false };
  } else {
    recordFailedLogin(req);
    return { valid: false, rateLimited: false };
  }
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
    const timeout = config.timeout || 15000;
    
    const options = { 
      timeout: timeout,
      rejectUnauthorized: false,
      family: 4,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };
    
    const req = protocol.get(service.url, options, (res) => {
      const responseTime = Date.now() - start;
      res.on('data', () => {}); // Force read response
      res.on('end', () => {
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
    });
    
    req.on('error', (err) => {
      console.error(`Error ${service.name}:`, err.code);
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
        responseTime: timeout,
        timestamp: new Date().toISOString()
      });
    });
  });
}

async function checkAllServices() {
  const results = await Promise.all(config.services.map(service => checkService(service)));
  return results;
}

const sessionMap = new Map();
const SESSION_DURATION = 24 * 60 * 60 * 1000;

function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(username) {
  const sessionId = generateSessionId();
  sessionMap.set(sessionId, {
    username,
    created: Date.now(),
    expires: Date.now() + SESSION_DURATION
  });
  return sessionId;
}

function validateSession(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return false;
  
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
  const sessionId = cookies.session;
  
  if (!sessionId) return false;
  
  const session = sessionMap.get(sessionId);
  if (!session) return false;
  
  if (Date.now() > session.expires) {
    sessionMap.delete(sessionId);
    return false;
  }
  
  return true;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const needsAuth = config.username && config.password;
  const url = req.url.split('?')[0];
  const isAuthenticated = needsAuth ? validateSession(req) : true;
  
  if (needsAuth && !isAuthenticated && url !== '/login' && url !== '/login.html' && url !== '/api/login') {
    if (url.startsWith('/api/') && url !== '/api/login') {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    
    fs.readFile(path.join(__dirname, 'public', 'login.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading login.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  } else if (url === '/api/login' && req.method === 'POST') {
    const rateLimit = checkRateLimit(req);
    if (!rateLimit.allowed) {
      res.writeHead(429);
      res.end(JSON.stringify({ error: 'Zu viele Versuche' }));
      return;
    }
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64 = authHeader.slice(6);
      const decoded = Buffer.from(base64, 'base64').toString();
      const [username, password] = decoded.split(':');
      
      if (username === config.username && password === config.password) {
        clearFailedLogin(req);
        const sessionId = createSession(username);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `session=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`
        });
        res.end(JSON.stringify({ success: true }));
      } else {
        recordFailedLogin(req);
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: 'Unauthorized' }));
      }
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'No credentials' }));
    }
    return;
  }
   
  if (url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (url === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (url === '/api/status') {
    const status = await checkAllServices();
    res.end(JSON.stringify(status));
  } else if (url === '/settings') {
    fs.readFile(path.join(__dirname, 'public', 'settings.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading settings.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (url === '/api/images') {
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
  } else if (url === '/api/config') {
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
  } else if (url.startsWith('/assets/')) {
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
