// Run this to set up database

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { query } = require('./pgPool'); // Use the existing pgPool.js for the bite database
require('dotenv').config();

const setupDatabase = async () => {

  const dbName = process.env.DB_NAME;
  const setupScript = path.join(__dirname, 'setup.sql');

  // Connection to default postgres database
  const postgresPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres',
  });

  try {
    // Connect to default postgres db
    console.log('Connecting to default postgres database...');
    const client = await postgresPool.connect();
    console.log('Connected to default postgres database successfully.');

    // Check if bite database exists
    console.log(`Checking if database ${dbName} exists...`);
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    console.log('Query submitted', { text: `SELECT 1 FROM pg_database WHERE datname = $1`, params: [dbName] });

    // If bite database does not exist, create
    if (res.rows.length === 0) {
      console.log(`Database ${dbName} does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }

    // Close connection to default postgres db
    await client.release();
    console.log('Connection to default postgres db closed.');

    // Connect to bite database to set up schema using pgPool.js and setup.sql
    console.log(`Connecting to database ${dbName} & creating schema...`);
    await query('BEGIN');
    const schema = fs.readFileSync(setupScript, 'utf-8');
    await query(schema);
    await query('COMMIT');
    console.log(`Database ${dbName} schema setup completed successfully.`);

  } catch (err) {
    console.error('Error during database setup:', err);
    try {
      await query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Error during rollback:', rollbackErr);
    }
  }
};

setupDatabase();