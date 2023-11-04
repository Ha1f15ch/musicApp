var express = require('express');
var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors');
var loger = require('./logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var path = require('path');
var fileUpload = require('express-fileupload');
var router = express.Router();

require('dotenv').config();

var ip = require('ip')
console.log(ip.address())


var routerAPI = require('./routes/main')
var routerAPIAdmin = require('./routes/adminRouter')
var routerAPIAuthorization = require('./routes/authorizationRouter')

var app = express();

var corsOptions = {
  /* origin: `http://${ip.address}:3000` */
  /* origin: `http://localhost:3000`,
  custom: `http://${ip.address}:3000` */
  origin: "*"
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
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "D:/music")));

const mongoConectURL = 'mongodb+srv://root:root@cluster0.zvucxtc.mongodb.net/?retryWrites=true&w=majority'
// old data connect = 'mongodb+srv://root:root@cluster0.iqkyd.mongodb.net/MusMarket?retryWrites=true&w=majority'
mongoose.connect(mongoConectURL)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Ошибка при подключении к БД: '));
db.once('open', function callback() {
  loger.info('Connected to dataBase')
})

app.use('/v1/api/main/', routerAPI)
app.use('/v1/api/adminCatalog/', routerAPIAdmin)
app.use('/v1/api/authorization/', routerAPIAuthorization)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404)
  loger.debug('Not found URL: ', req.url);
  res.send({error: 'not found'})
  return next();
});

// error handler
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  loger.error('Internal error: ',res.statusCode,err.message);
  res.send({ error: err.message });
  return;
});

app.get('/ErrorExample', function(req, res, next){
  next(new Error('Random error!'));
});

/* // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('errorMessage');
}); */

module.exports = app;
