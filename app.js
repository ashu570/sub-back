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

app.post('/download', async (req, res) => {
  try {
    const subIds = req.body.ids;

    const results = [];

    for (const subId of subIds) {
      const data = { file_id: subId };

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.opensubtitles.com/api/v1/download',
        headers: {
          'Api-Key': 'Dt49ZXVqqDVspIRChYULD5hTOo44vpeJ',
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios(config);
      results.push(response.data.link); 

      let subtitlePromises = results.map(async(url)=>{
        const responseSub = await axios.get(url, { responseType: 'arraybuffer' });
        return {
          filename: `subtitle_${results.indexOf(url) + 1}.srt`,
          data: response.data,
        };
      })
      const subtitles = await Promise.all(subtitlePromises);

      // Set appropriate headers for a ZIP file containing all subtitles
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=subtitles.zip');
  
      // Send all subtitles as a ZIP file to the client
      res.send(subtitles);
    }
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
