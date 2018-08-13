require('dotenv').config()
const createError  = require('http-errors');
const express      = require('express');
const app          = express();
const cors         = require('cors');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');

const index        = require('./routes/index');
const customer     = require('./routes/customer');
const transaction  = require('./routes/transaction');
const item         = require('./routes/item');

//mongoose connection
const mongoose     = require('mongoose');
const dbUrl        = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@ds125381.mlab.com:25381/ecom`;
mongoose.connect(dbUrl, (err) => {
  if(!err) {
    console.log('success connected to database');
  } else {
    console.log('error Connected to database');
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({origin: 'http://localhost:8080'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index)
app.use('/customers', customer)
app.use('/transactions', transaction)
app.use('/items', item)

// handle cors access control 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

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
