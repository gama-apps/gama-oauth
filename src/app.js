require('dotenv').config();
require('./libs/util');
const File = require('./libs/file');
const express = require('express');
const path = require('path');
const body_parser = require('body-parser');
const cors = require('cors');
const logger = require('./libs/logger');
const routes = require('./routes/index');
const mongooseConnection = require('./libs/db');
require('express-group-routes');
const http = require("http");

const app = express();

File.createFolderIfNotExist(`${process.env.STORAGE_FOLDER}`);
File.createFolderIfNotExist(`${process.env.STORAGE_FOLDER}/tmp`);
File.createFolderIfNotExist(`${process.env.STORAGE_FOLDER}/tmp/sessions`);

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.render("index", {title: "E-Commerce"})
});

app.group('/api/v1', router => {
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });

  router.use('/', routes);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found.');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env').trim() === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);

  logger.error(`${err.status || 500} - ${err.message}`);

  res.render('error');
});

//Cerrar la conexion a la base de datos al cerrar la aplicacion 
process.on('SIGINT', () => {
  mongooseConnection.close(() => {
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

const port = normalizePort(process.env.PORT || 25995);
app.set('port', port);

const server = http.createServer(app);

server.listen(port, function(){
  console.log(`Server running in PORT ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if(error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind +' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ?
    'pipe ' + addr
    :
    'port ' + addr.port;
  console.log(`Listening on ${bind}`);
}