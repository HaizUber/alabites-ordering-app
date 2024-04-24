// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@alabites.xcgzfpd.mongodb.net/?retryWrites=true&w=majority&appName=alabites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
