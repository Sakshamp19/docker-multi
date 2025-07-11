const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Allow requests from browser HTML form

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/contactdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Define the contact schema and model
const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  message: String,
});

// POST route to handle form submission
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(200).send(`
      <html>
        <head><title>Submitted</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 3rem;">
          <h2 style="color: green;">✅ Thank you, ${name}!</h2>
          <p>We have received your message and will get back to you soon.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 3rem;">
          <h2 style="color: red;">❌ Something went wrong!</h2>
          <p>Please try again later.</p>
        </body>
      </html>
    `);
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
