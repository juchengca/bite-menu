// MAIN SERVER FILE

const express = require('express');
const path = require('path');
require('dotenv').config();

const { sync } = require('./controllers/syncMenu');

const app = express();
const port = process.env.PORT || 3000;

const statics = path.join(__dirname, '../public');

app.use(express.static(statics));
app.use(express.json());

// Root route displaying link to trigger-sync
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Bite Menu</h1>
        <a href="/trigger-sync">Sync Menu</a>
      </body>
    </html>
  `);
});

// Route to trigger-sync
app.get('/trigger-sync', sync);

// Start server and listen on degined port
app.listen(port, () => {
  console.log(`Bite Menu listening on port ${port}`);
});