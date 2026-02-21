const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://jigarthanda_user:OtVnd92l0RpbBE5AO9qe090pBcDqbrb5@dpg-d6bd1qgboq4c73fiiom0-a/jigarthanda_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  console.log('🗄️ Setting up database...');
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        district VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        items JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        payment_type VARCHAR(50) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)
    `);
    
    // Insert sample user if not exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      ['73581ecb-547c-4e2e-b357-5082a2d000ae']
    );
    
    if (userResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (id, name, email, district, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [
          '73581ecb-547c-4e2e-b357-5082a2d000ae',
          'Mohamed Nazir',
          'mohamed_nazir@example.com',
          'Madurai',
          'mock-password-hash',
          NOW(),
          NOW()
        ]
      );
      console.log('👤 Sample user created');
    }
    
    console.log('✅ Database setup complete');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
