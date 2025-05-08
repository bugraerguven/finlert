// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to your first Node.js backend project!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

