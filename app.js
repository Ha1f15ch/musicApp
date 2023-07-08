var express = require('express');
var logger = require('morgan');
var loger = require('./logger')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path')

var routerAPI = require('./routes/main')
var routerAPIAdmin = require('./routes/adminRouter')

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'D:/music')));
app.use(express.urlencoded({ extended: false })); //oeizahq

const mongoConectURL = 'mongodb+srv://root:root@cluster0.zvucxtc.mongodb.net/?retryWrites=true&w=majority'
// old data connect = 'mongodb+srv://root:root@cluster0.iqkyd.mongodb.net/MusMarket?retryWrites=true&w=majority'
mongoose.connect(mongoConectURL)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Ошибка при подключении к БД: '));
db.once('open', function callback() {
  loger.info('Connected to dataBase')
})

app.use('/', routerAPI)
app.use('/v1/api/adminCatalog/', routerAPIAdmin)

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
