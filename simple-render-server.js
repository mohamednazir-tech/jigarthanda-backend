const http = require('http');
const { Pool } = require('pg');

console.log('🚀 Starting Jigarthanda Backend for Render...');

// Configure for Render
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://jigarthanda_user:OtVnd92l0RpbBE5AO9qe090pBcDqbrb5@dpg-d6bd1qgboq4c73fiiom0-a/jigarthanda_db';
const API_URL = process.env.RENDER_EXTERNAL_URL || 'https://jigarthanda-backend.onrender.com';

// PostgreSQL connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
      
      req.on('end', async () => {
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
            // Get today's orders from database
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            
            const result = await pool.query(
              'SELECT * FROM orders WHERE created_at >= $1 AND created_at < $2 AND user_id = $3 ORDER BY created_at DESC',
              [startOfDay, endOfDay, requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae']
            );
            
            responseData = result.rows;
          } else if (req.url.includes('orders.getByUser')) {
            // Get all orders for user from database
            const result = await pool.query(
              'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
              [requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae']
            );
            
            responseData = result.rows;
          } else if (req.url.includes('orders.getMonthlyReport')) {
            // Get monthly report from database
            const result = await pool.query(
              'SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as sales FROM orders WHERE user_id = $1 AND DATE(created_at) >= DATE_TRUNC(\'month\', CURRENT_DATE) ORDER BY DATE(created_at) DESC',
              [requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae']
            );
            
            const totalResult = await pool.query(
              'SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_sales FROM orders WHERE user_id = $1 AND DATE(created_at) >= DATE_TRUNC(\'month\', CURRENT_DATE)',
              [requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae']
            );
            
            responseData = {
              totalSales: parseFloat(totalResult.rows[0].total_sales) || 0,
              totalOrders: parseInt(totalResult.rows[0].total_orders) || 0,
              dailySales: result.rows
            };
          } else if (req.url.includes('orders.create')) {
            // Create order in database
            const { items, total, paymentType, customerName } = requestData.input;
            
            const orderResult = await pool.query(
              'INSERT INTO orders (user_id, items, total, payment_type, customer_name, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
              [
                requestData.input?.userId || '73581ecb-547c-4e2e-b357-5082a2d000ae',
                JSON.stringify(items),
                total,
                paymentType,
                customerName || 'Walk-in Customer',
                new Date()
              ]
            );
            
            responseData = orderResult.rows[0];
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
        database: 'connected',
        database_url: DATABASE_URL,
        api_url: API_URL
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
