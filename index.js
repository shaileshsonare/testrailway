const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/hi', (req, res) => {
  res.send('Hello World');
});

// Root endpoint just if they want to see it running
app.get('/', (req, res) => {
    res.send('Welcome to Express on Railway! Go to <a href="/hi">/hi</a> to see the hello world message.');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
