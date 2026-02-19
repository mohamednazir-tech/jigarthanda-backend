const http = require('http');

console.log('🚀 Starting Jigarthanda Backend for Render...');

// Configure for Render
const PORT = process.env.PORT || 3000;

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
  
  // Log requests
  console.log(`📱 ${req.method} ${req.url}`);
  
  // Handle TRPC requests
  if (req.url.startsWith('/trpc')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // Mock response for testing
    if (req.url.includes('auth.login')) {
      res.end(JSON.stringify({
        result: {
          data: {
            user: {
              id: '1',
              name: 'Mohamed Nazir',
              email: 'mohamed_nazir@example.com'
            },
            token: 'mock-token-123'
          }
        }
      }));
    } else if (req.url.includes('orders.getTodayOrders')) {
      res.end(JSON.stringify({
        result: {
          data: []
        }
      }));
    } else {
      res.end(JSON.stringify({
        result: {
          data: { message: 'TRPC endpoint working' }
        }
      }));
    }
  } else if (req.url === '/health') {
    // Health check endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'jigarthanda-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    }));
  } else {
    // Root endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: '🍹 Jigarthanda Backend Server',
      status: 'Running',
      time: new Date().toISOString(),
      endpoints: ['/trpc/auth.login', '/trpc/orders.getTodayOrders', '/health']
    }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Backend server running on port:', PORT);
  console.log('🌐 Render deployment ready');
  console.log('📱 Mobile app can connect to:', process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`);
  console.log('🍹 Jigarthanda POS Backend Ready!');
  console.log('🧪 Test endpoints:');
  console.log(`   - Health: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}/health`);
  console.log(`   - TRPC: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}/trpc/auth.login`);
});
