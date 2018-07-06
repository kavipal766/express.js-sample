var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./config/config');
var http = require('http');
var app = express();
var mongodb = require("mongodb");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//mongodb connectivity//
// var databaseConnectionURL =(mongodb://localhost:27017/User);
// console.log("*****************************Connection URL:*****",databaseConnectionURL);
var dataob = config.db;
console.log("ssnssb"+dataob);
  mongoose.connect(dataob,function (err, database) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    // Save database object from the callback for reuse.=
    db = database;
    console.log("****MongoDB Database connection ready****");
  });



// ============================Server createion start================================
var port = config.port;
app.set(port);
var server = http.createServer(app);
server.listen(port, function() {
    console.log("server is running on 3000")
});

// ============================Server createion end================================

// ===============================Routing==========================
// app.use('/', indexRouter);
app.use('/users', usersRouter);
//================================Routing end===============================
// app.use('/',function(req, res, next) {
//   res.send({status : 200,title: 'Express' });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
