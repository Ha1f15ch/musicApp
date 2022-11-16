var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const roleMidleware = require('./middleware/roleMidleware')

const mongoConectURL = 'mongodb+srv://root:root@cluster0.iqkyd.mongodb.net/MusMarket?retryWrites=true&w=majority'
mongoose.connect(mongoConectURL)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Ошибка при подключении к БД: '));

//var indexRouter = require('./routes/index'); - нужно добавить остальное, потом...
var authorization = require('./routes/auth');
var login = require('./routes/log_In');
var mainPage = require('./routes/MainPage');
var storage_katalog = require('./routes/Storage_katalog');
var indexJS = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'D:/music')));

app.use('/', login);
app.use('/main', mainPage);
// app.use('/login', login);
app.use('/auth', authorization);
app.use('/admin_mod', roleMidleware(['ADMIN']), storage_katalog); //Доступ для изменения составляющего и настройки всех таблиц
//app.use('/auth', AuthRouts); после нуждно додумать остальные роуты
// пока что выводится только регистрация

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
