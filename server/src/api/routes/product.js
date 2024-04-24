// server/src/api/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('./models/Product');

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Add routes for other CRUD operations (create, read, update, delete) as needed

module.exports = router;
