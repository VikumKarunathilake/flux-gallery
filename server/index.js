// server/index.js
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

/* global process */

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Database configuration using connection URL
const dbConfig = {
  uri: process.env.DATABASE_URL, // Your SQL connection URL
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(limiter);

// Create database connection pool with enhanced error handling
let pool;

async function initializeDatabase() {
  try {
    // Create pool using connection URL
    pool = mysql.createPool(dbConfig.uri);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    
    // Test a simple query
    await connection.query('SELECT 1');
    console.log('Database query test successful');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization error:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      // Mask sensitive connection details in logs
      uri: dbConfig.uri?.replace(/\/\/[^@]*@/, '//****:****@')
    });
    return false;
  }
}

// Middleware to check database connection
const checkDatabaseConnection = (req, res, next) => {
  if (!pool) {
    return res.status(503).json({ 
      error: 'Database connection not established',
      details: process.env.NODE_ENV === 'development' ? 'Database pool not initialized' : undefined
    });
  }
  next();
};

app.use(checkDatabaseConnection);

app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1');
    connection.release();
    res.json({ message: 'Database connection successful', rows });
  } catch (error) {
    console.error('Test DB connection error:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

// Get images with pagination
app.get('/api/images', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = Math.min(parseInt(req.query.per_page) || 12, 50);
  const startIndex = (page - 1) * perPage;

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(`
        SELECT * FROM generated_images
        ORDER BY generation_timestamp DESC
      `, [startIndex, perPage]);

      const [[{ total }]] = await connection.execute(
        'SELECT COUNT(*) as total FROM generated_images'
      );

      res.set({
        'Cache-Control': 'public, max-age=300',
        'X-Total-Count': total,
        'X-Total-Pages': Math.ceil(total / perPage)
      });

      res.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching images:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to fetch images',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single image by ID with error handling
app.get('/api/images/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM generated_images WHERE id = ?',
        [req.params.id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.set('Cache-Control', 'public, max-age=3600');
      res.json(rows[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching image:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to fetch image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database before starting server
initializeDatabase().then(success => {
  if (success) {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } else {
    console.error('Failed to initialize database. Server not started.');
    process.exit(1);
  }
});
