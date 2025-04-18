const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// PostgreSQL connection
const pool = new Pool({
  user: 'guruvishnusaravanan', // <-- replace with your macOS DB username
  host: 'localhost',
  database: 'voting_db',
  password: '', // or add your password if needed
  port: 5432,
});

// POST route to vote
app.post('/vote', async (req, res) => {
    console.log('Request body:', req.body); // Log the request data
    const { option } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE votes SET count = count + 1 WHERE option = $1 RETURNING *', 
        [option]
      );
      console.log('Updated result:', result.rows);  // Log the result of the update
      res.sendStatus(200);
    } catch (err) {
      console.error('Error in /vote:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// GET route to fetch results
app.get('/results', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM votes');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /results:', err);
    res.status(500).send('Error retrieving results');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

