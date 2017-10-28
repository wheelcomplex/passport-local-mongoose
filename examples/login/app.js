const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// https://gist.github.com/nikmartin/5902176
// https://stackoverflow.com/questions/23566555/whats-difference-with-express-session-and-cookie-session
const session = require('cookie-session');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));

app.use(express.static(path.join(__dirname, 'public')));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect mongoose
// "mongodb://admin:CUNFSFOJYOOXZKUH@sl-us-south-1-portal.11.dblayer.com:26050,sl-us-south-1-portal.9.dblayer.com:26050/compose?ssl=true&authSource=admin"
// mongoose.connect('mongodb://localhost/passport_local_mongoose_examples', function(err) {
mongoose.connect("mongodb://admin:CUNFSFOJYOOXZKUH@sl-us-south-1-portal.11.dblayer.com:26050,sl-us-south-1-portal.9.dblayer.com:26050/compose?ssl=true&authSource=admin", function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});

// Register routes
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// module.exports = app;
var listenAddress = "0.0.0.0";
var listenPort = 3080;
app.listen(listenPort);
console.log('server started on http://'+listenAddress+':'+listenPort+'/');
