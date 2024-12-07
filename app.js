const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 80;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in the request body
app.use(express.json());

// Endpoint to handle incoming requests
app.post('/request', async (req, res) => {
  // Assuming the request body contains a field named "string"
  const receivedString = req.body.string;

  // Save the received string to the variable 'url'
  // You can replace 'url' with any variable name you prefer
  // Do something with the string, for now, we are logging it
  console.log('Received String:', receivedString);

  // Axios configuration with the dynamic URL
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: receivedString,
    headers: {
      'Api-Key': 'xn1z8bxWjIiy7ymLrsBZ8hCzvXFsrMKz',
      'User-Agent':'PostmanRuntime/7.35.0'
    },
  };

  try {
    // Make the Axios GET request
    const axiosResponse = await axios(config);

    // Return the result from the GET request
    res.status(200).json(axiosResponse.data);
  } catch (error) {
    // Handle errors
    console.error('Axios GET request error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/download', async (req, res) => {
  try {
    const subId = req.body.id;
    const data = { file_id: subId };
    const config = {
      method: 'POST',
      url: 'https://api.opensubtitles.com/api/v1/download',
      headers: {
        'User-Agent': 'PostmanRuntime/7.35.0',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': 'xn1z8bxWjIiy7ymLrsBZ8hCzvXFsrMKz'
      },
      data: data,
    };
    const response = await axios(config);
    const result = response.data.link;
    const sub = await axios.get(result);
    res.setHeader('Content-Type', 'application/x-subrip');
    res.setHeader('Content-Disposition', 'attachment; filename=subtitles.srt');
    res.send(sub.data);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
