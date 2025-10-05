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

app.post('/', async (req, res) => {
  try {
    const trxid = crypto.randomBytes(8).toString("hex");
    const orderid = crypto.randomBytes(8).toString("hex");
    console.log("The orderid is " + orderid);
    console.log("The trxid is " + trxid);
    console.log("The password is " + process.env.MASTERCARD_AUTH_TOKEN);
    console.log("The API Version is " + process.env.API_VERSION);
    
    const postData = {
      "apiOperation": "INITIATE_CHECKOUT",
      "checkoutMode": "WEBSITE",
      "interaction": {
        "operation": "PURCHASE",
        "displayControl": {
            "billingAddress": "HIDE"
        },
        "merchant": { 
          "name": process.env.MERCHANT_NAME || "ABC Enterprises LLC",
          "url": process.env.MERCHANT_URL || "https://mastercard.com"
        },
        "returnUrl": process.env.RETURN_URL || "https://hosted-checkout-embedded-page.vercel.app/ReceiptPage"
      },
      "order": {
        "currency": process.env.CURRENCY || "USD",
        "amount": process.env.DEFAULT_AMOUNT || "99.00",
        "id": orderid,
        "description": process.env.ORDER_DESCRIPTION || "Goods and Services"
      }
    };

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Authorization': `Basic ${process.env.MASTERCARD_AUTH_TOKEN}`,
        "Accept": "application/json"
      }
    };

    const apiUrl = `${process.env.MASTERCARD_API_BASE_URL}/api/rest/version/${process.env.API_VERSION}/merchant/${process.env.MERCHANT_ID}/session`;
    const response = await axios.post(apiUrl, postData, axiosConfig);
    
    console.log("RESPONSE RECEIVED Create: ", response.data.session.id);
    const sessionId = response.data.session.id;
    console.log("The orderid is " + orderid);
    console.log("The trxid is " + trxid);
    console.log("The password is " + process.env.MASTERCARD_AUTH_TOKEN);
    console.log("The API Version is " + process.env.API_VERSION);
    console.log("The sessionId in backend is " + sessionId);
    res.send(sessionId);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
