const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 1234;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function query(data) {
  const response = await fetch(
      "http://localhost:3000/api/v1/prediction/7ab03e5c-d5c0-4cfc-bfa5-7cd1c3a4e12d",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }
  );
  const result = await response.json();
  return result;
}

app.post('/getChatResponse', async (req, res) => {
  const { userInput } = req.body;
  try {
      query({"question": userInput}).then((responseData) => {
        res.send({ response: responseData.text });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
