const { json, urlencoded } = require('express');
const { port, mongoURI } = require('./config');
const { setupMongo } = require('./util');
const router = require('./router');

const app = require('express')();
class Server {
  constructor(app, port, mongoURI) {
    this.port = port;
    this.mongoURI = mongoURI
    this.app = app;
    this.configure();
  }
  
  configure() {
    const { app } = this;
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(router);
  }

  async start() {
    const { mongoURI, port, app } = this;
    await setupMongo(mongoURI);
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  }
}

module.exports = new Server(app, port, mongoURI);