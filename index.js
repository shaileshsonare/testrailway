require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MySQL connection pool (Hardcoded values as requested)
const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'GAHvNWZobpwzZFakhibKgcBeJteUtikx',
  database: process.env.MYSQLDATABASE || 'railway', // Default to 'railway' if not found
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET: Root
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "DB Error: " + err.message });
    }
});

// GET: All Employees (Duplicate for convenience)
app.get('/employees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "DB Error: " + err.message });
    }
});

app.get('/hi', (req, res) => {
  res.send('Hello World');
});

// CREATE: Add new employee
app.post('/employees', async (req, res) => {
    const { name, department, salary } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO employee (name, department, salary) VALUES (?, ?, ?)',
            [name, department, salary]
        );
        res.status(201).json({ id: result.insertId, name, department, salary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
