const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Serve static files (landing page HTML)
app.use(express.static('public'));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Placeholder for tracking user visit time
let visitTimestamps = {};

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');  // Serve the landing page
});

// Track when the user clicks "Verify" to redirect to the bot
app.post('/track', (req, res) => {
  const { userId } = req.body;
  const currentTime = new Date().getTime();

  // Store the timestamp when the user visits the page
  visitTimestamps[userId] = currentTime;
  console.log(`User ${userId} visited at ${new Date(currentTime)}`);

  // Redirect to the bot after user clicks "Verify"
  res.redirect('https://t.me/LuckyDrawMasterBot/app?startapp=Y2g9a1FqOXh2SFI3RyZnPXNwJmw9a1FqOXh2SFI3RyZzbz1TaGFyZSZ1PTU0OTA3NzU2NTM%3D&utm_source=telegram&utm_medium=bot&utm_campaign=Referral+');
});

// Check if user stayed on the bot for 10 seconds
app.post('/verify', (req, res) => {
  const { userId } = req.body;
  const currentTime = new Date().getTime();

  // Check if the user stayed on the bot for at least 10 seconds
  if (visitTimestamps[userId] && (currentTime - visitTimestamps[userId] >= 10000)) {
    res.send({ success: true, message: 'User verified, access granted!' });
  } else {
    res.send({ success: false, message: 'User did not stay long enough on the bot.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
