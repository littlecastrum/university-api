const mongoose = require('mongoose');

async function setupMongo(mongoURI) {
  mongoose.Promise = global.Promise;
  db = await mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });
  mongoose.connection.on('error', console.log.bind(console, 'MongoDB Connection error'));
}

module.exports = {
  setupMongo
}