var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload')
var bodyParser = require('body-parser')
var cors = require('cors')

const mongoConectURL = 'mongodb+srv://root:root@cluster0.iqkyd.mongodb.net/MusMarket?retryWrites=true&w=majority'
mongoose.connect(mongoConectURL)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Ошибка при подключении к БД: '));

//var authentication = require()-------------------------------------------------------------------------------------
var mainPage = require('./routes/MainPage');
var storage_katalog = require('./routes/Storage_katalog');
var startFunction = require('./routes/startFunction')

var app = express();

var corsOptions = {
  origin: "http://localhost:3000"
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'D:/music')));

//app.use('', ) -------------------------------------------------------------------
app.use('/', startFunction);
app.use('/main', mainPage);
app.use('/admin_mod', storage_katalog);
require('./routes/auth.router')(app);
require('./routes/test.router')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
