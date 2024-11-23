const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/noteRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route for the root endpoint ("/")
app.get('/', (req, res) => {
  res.send('Welcome to the Note API!'); // This will respond when accessing http://localhost:5000/
});

// Routes for notes
app.use('/api/notes', noteRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
