const express = require('express');
const { json, urlencoded } = require('express');
const mongoose = require('mongoose');
const { port, mongoURI } = require('./config');

const app = express()

async function setupMongo() {
  mongoose.Promise = global.Promise;
  db = await mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });
  mongoose.connection.on('error', console.log.bind(console, 'MongoDB Connection error'));
}

app.use(json());
app.use(urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!'))

app.start = async function() {
  await setupMongo();
  this.listen(port, () => console.log(`Example app listening on port ${port}!`))
}


module.exports = app;