// server/src/api/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./db');
const middlewares = require('./middlewares');
const api = require('./api');

require('dotenv').config();

const app = express();

connectDB();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1/products', productsRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
