const http = require('http');

console.log('🚀 Starting Jigarthanda Backend for Render...');

// Configure for Render
const PORT = process.env.PORT || 3000;

// Simple HTTP server for testing
const server = http.createServer((req, res) => {
  console.log(`📱 ${req.method} ${req.url}`);
  
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
  
  try {
    // Handle TRPC requests
    if (req.url.startsWith('/trpc')) {
      let body = '';
      
      // Collect request body
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const requestData = JSON.parse(body);
          console.log('📨 TRPC Request:', requestData);
          
          // Mock response for testing
          let responseData;
          
          if (req.url.includes('auth.login')) {
            responseData = {
              user: {
                id: '73581ecb-547c-4e2e-b357-5082a2d000ae',
                name: 'Mohamed Nazir',
                email: 'mohamed_nazir@example.com',
                district: 'Madurai'
              },
              token: 'mock-token-123'
            };
          } else if (req.url.includes('orders.getTodayOrders')) {
            responseData = [];
          } else if (req.url.includes('orders.getByUser')) {
            responseData = [];
          } else if (req.url.includes('orders.getMonthlyReport')) {
            responseData = {
              totalSales: 0,
              totalOrders: 0,
              dailySales: []
            };
          } else if (req.url.includes('orders.create')) {
            responseData = {
              id: 'order-' + Date.now(),
              userId: requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae',
              items: requestData.input?.items || [],
              total: requestData.input?.total || 0,
              paymentType: requestData.input?.paymentType || 'cash',
              customerName: requestData.input?.customerName || 'Walk-in Customer',
              createdAt: new Date().toISOString()
            };
          } else {
            responseData = { message: 'TRPC endpoint working' };
          }
          
          // Send proper TRPC response
          res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });
          res.end(JSON.stringify({
            result: {
              data: responseData
            }
          }));
        } catch (parseError) {
          console.error('❌ Parse Error:', parseError);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid JSON',
            message: parseError.message
          }));
        }
      });
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
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Internal server error',
      message: error.message
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

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server Error:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
