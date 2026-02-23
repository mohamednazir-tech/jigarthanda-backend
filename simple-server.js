const http = require('http');

console.log('🚀 Starting Simple Jigarthanda Backend Server...');

// Simple HTTP server for testing
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Collect request body for POST requests
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    // Log requests
    console.log(`📱 ${req.method} ${req.url}`);
    if (body) {
      console.log('📦 Request body:', body);
    }
    
    // Handle TRPC requests
    if (req.url.startsWith('/trpc')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // Mock response for testing
    if (req.url.includes('auth.login')) {
      res.end(JSON.stringify({
        result: {
          data: {
            json: {
              user: {
                id: '1',
                name: 'Mohamed Nazir',
                username: 'mohamednazir',
                district: 'Madurai'
              },
              token: 'mock-token-123'
            }
          }
        }
      }));
    } else if (req.url.includes('auth.signup')) {
      res.end(JSON.stringify({
        result: {
          data: {
            json: {
              user: {
                id: '2',
                name: 'New User',
                username: 'newuser',
                district: 'Chennai'
              },
              token: 'mock-token-456'
            }
          }
        }
      }));
    } else {
      res.end(JSON.stringify({
        result: {
          data: {
            json: { message: 'TRPC endpoint working' }
          }
        }
      }));
    }
  } else {
    // Root endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: '🍹 Jigarthanda Backend Server',
      status: 'Running',
      time: new Date().toISOString(),
      endpoints: ['/trpc/auth.login', '/trpc/orders.getTodayOrders']
    }));
  }
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🎉 Backend server running on https://jigarthanda-backend.onrender.com');
  console.log('📱 Mobile app can connect to: https://jigarthanda-backend.onrender.com/trpc');
  console.log('🍹 Jigarthanda POS Backend Ready!');
  console.log('🧪 Test endpoints:');
  console.log('   - https://jigarthanda-backend.onrender.com/trpc/auth.login');
  console.log('   - https://jigarthanda-backend.onrender.com/trpc/orders.getTodayOrders');
});
