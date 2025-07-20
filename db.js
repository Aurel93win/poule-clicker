const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getCounter() {
  const res = await pool.query('SELECT count FROM clicks WHERE id = 1');
  if (res.rows.length === 0) return 0;
  return res.rows[0].count;
}

async function setCounter(value) {
  const res = await pool.query(
    `INSERT INTO clicks (id, count) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET count = $1`,
    [value]
  );
  return res;
}

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY,
      count INTEGER NOT NULL
    )
  `);
}

module.exports = { getCounter, setCounter, initDB };
