// server/models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  // Add more fields as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
