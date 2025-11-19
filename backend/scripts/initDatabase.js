const pool = require('../config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database initialization...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('📊 Tables created: users, goals, progress_entries');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });
