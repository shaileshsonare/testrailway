require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ Use MYSQL_URL (Railway recommended)
const pool = mysql.createPool(process.env.MYSQL_URL);

// ✅ Optional: Test DB connection at startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
})();

// ✅ Root route
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employee');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// ✅ Employees route
app.get('/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employee');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// ✅ Health check
app.get('/hi', (req, res) => {
  res.send('Hello World');
});

// ✅ Create employee
app.post('/employees', async (req, res) => {
  const { name, department, salary } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO employee (name, department, salary) VALUES (?, ?, ?)',
      [name, department, salary]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      department,
      salary
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});