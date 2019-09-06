# Univeristy API

## Installation

To run in local development enviroments you can just install the dependencies add the configuration 
to your Mongo Database and start the server
```bash
  npm install
  touch .env
  echo 'MONGO_URI=<your db uri>' > .env
  npm run dev
```

For using `docker` there are 3 commands ready to build, run and access the container
```bash
  npm run docker:build
  npm run docker:run
  npm run docker:bash
```

## Documentation
- [Routes](https://github.com/littlecastrum/university-api/wiki/Routes)


## Todo
[ ] - Tests
[ ] - Deployment