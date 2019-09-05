const { json, urlencoded } = require('express');
const { port, mongoURI } = require('./config');
const { setupMongo, extractUris } = require('./util');
const router = require('./router');

const app = require('express')();
class Server {
  constructor(app, port, mongoURI, router) {
    this.port = port;
    this.mongoURI = mongoURI;
    this.app = app;
    this.router = router;
    this.configure();
  }
  
  configure() {
    const { app } = this;
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use('/api', this.router);
  }

  async start() {
    const { mongoURI, port, app } = this;
    const uris = extractUris(this.router);
    await setupMongo(mongoURI);
    this.instance = await app.listen(port);
    console.log(`\n Server listening on port http://localhost:${port}/api\n\n Following endpoints available:`);
    uris.forEach(uri => console.log(uri));
  }
}

module.exports = new Server(app, port, mongoURI, router);