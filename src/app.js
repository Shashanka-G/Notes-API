const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/note-api-test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error(err));

app.use(bodyParser.json());

// Basic Authentication Middleware
const authenticate = (req, res, next) => {
  const credentials = auth(req);

  if (!credentials || credentials.name !== 'Shashanka G' || credentials.pass !== 'NotesApiP@ssw0rd') {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    next();
  }
};

// Apply Basic Authentication middleware to all routes under '/notes'
app.use('/notes', authenticate);

// Routes
const noteRoutes = require('./routes/noteRoute');
app.use('/notes', noteRoutes);

// Export the server instance for testing
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;