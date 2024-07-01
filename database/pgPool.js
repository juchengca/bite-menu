// Connection to PostgreSQL Database

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const query = (text, params) => {
  //console.log('Query submitted', { text, params });
  return pool.query(text, params);
};

module.exports = {
  pool,
  query
};