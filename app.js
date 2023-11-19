const express = require('express');
const axios = require('axios');
const cors = require('cors');

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
      'Api-Key': 'Dt49ZXVqqDVspIRChYULD5hTOo44vpeJ',
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
