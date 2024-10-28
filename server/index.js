import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbUrl = new URL(process.env.DATABASE_URL);

// Database configuration
const dbConfig = {
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Removes leading "/"
  };

app.use(cors());
app.use(express.json());

// Create database connection pool
const pool = mysql.createPool(dbConfig);


// Get all images
app.get('/api/images', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM generated_images ORDER BY generation_timestamp DESC`);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });

// Get single image by ID
app.get('/api/images/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM generated_images WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

app.get('/', (req, res) => {
    res.send('Welcome to the API. Access images at /api/images');
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}
);