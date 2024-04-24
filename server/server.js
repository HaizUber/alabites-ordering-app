
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://admin:<password>@alabites.xcgzfpd.mongodb.net/?retryWrites=true&w=majority&appName=alabites';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));
