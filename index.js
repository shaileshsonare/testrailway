require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('<h1>Express with MySQL on Railway</h1><p>Endpoints:<br>GET /employees<br>POST /employees (body: {name, department, salary})</p>');
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

// READ: Get all employees
app.get('/employees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employee');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
