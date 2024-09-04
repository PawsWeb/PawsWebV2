// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const configureMiddleware = require('./middleware');
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const faqRoutes = require('./routes/faq');
const educationalRoutes = require('./routes/educational');

dotenv.config();

const app = express();

// Apply middleware
configureMiddleware(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Mount routes
app.use('/auth', authRoutes);
app.use('/pet', petRoutes);
app.use('/faq', faqRoutes);
app.use('/educational', educationalRoutes);


app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
