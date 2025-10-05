const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require("crypto");
const http = require('http');
const https = require('https');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3005;
// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mastercard Payment Gateway API',
    timestamp: new Date().toISOString()
  });
});

// Favicon handler (prevents 404s)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
