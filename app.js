// Base Express
var compression    = require('compression');
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var session        = require('express-session');

// Routes
var paginate       = require('express-paginate');
var routes         = require('./routes/index');
var shots          = require('./routes/shots')
var users          = require('./routes/users')
var methodOverride = require('method-override')

// Schema & Passport
var mongoose       = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var MongoStore     = require('connect-mongo')(session);

// Stylus
var stylus         = require('stylus');
var nib            = require('nib');

var moment         = require('moment');
var _              = require('lodash')

var cloudinary     = require('cloudinary');

// App
var app            = express();

// Compression
app.use(compression()); 

// Cloudinary
// Cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Pagination
app.use(paginate.middleware(12, 24));

// Method OVERRIDE
app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(stylus.middleware(
  { 
    src: __dirname + '/public/stylesheets/',
    dest: __dirname + '/public/stylesheets/',
    force : true,
    debug : true,
    sourcemap : true,
    compile : function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
    }
  }
))

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Express sessions
app.use(session({
  store: new MongoStore({
    url: process.env.MONGO_URL
  }),
  secret: process.env.APP_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

// View Helpers
// Register if user has been authD
app.use(function(req, res, next) {
  res.locals.userAuth = req.user;
  next();
});

// Parse the color data returned from Cloudinary
app.locals.parseColors = function(ary){
  return '<span style="width:' + ary[1] + '%;height:8px;display:inline-block;background-color:' + ary[0] +'"></span>'
}

// Add a body tag for helping with different layouts
app.locals.addBodyTag = function(str){
  return req.protocol + "://" + req.get('host') + req.originalUrl;
}

// Cloudinary ref for views
app.locals.cloudinary = cloudinary;

// Pretty dates using format package
app.locals.parseDate = function(timestamp){
  return moment().format('MMM Do YYYY');
}

app.locals.parseCamelCase = function(str){
  return str.split(/(?=[A-Z])/).join(" ");
}

// Helper to see if current user is a fan of a shot
app.locals.isFan = function(user, fans) {
  var mapped = _.map(fans, '_id')
  if(_.findIndex(mapped, user._id) != -1) {
    return 0;
  } else {
    return -1;
  }
}

// Static Path
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/shots', shots);
app.use('/users', users);

// Passport Config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose
mongoose.connect(process.env.MONGO_URL);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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


module.exports = app;
