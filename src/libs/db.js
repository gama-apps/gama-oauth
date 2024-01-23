const mongoose = require('mongoose');
const logger = require('./logger');

mongoose.connect(process.env.DB_E_COMMERCE_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // Elimina las opciones obsoletas
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  logger.info('Connected to MongoDB');
});

module.exports = db;
