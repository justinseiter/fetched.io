var express              = require('express');
var passport             = require('passport');
var ensureAuthentication = require('../middleware/ensureAuthentication');
var User                 = require('../models/user');
var async                = require('async');
var router               = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (req, res) {
  res.redirect('/shots');
});

router.get('/register', function(req, res) {
  res.render('auth/register', { bodyClassTag: 'auth' });
});

router.post('/register', function(req, res) {
  User.register(new User({ username : req.body.username, email : req.body.email }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', {info: "Sorry. That username already exists. Try again."});
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/start');
    });
  });
});

router.get('/start', ensureAuthentication, function(req, res) {
  res.render('auth/start', { bodyClassTag: 'auth' });
});

router.get('/login', function(req, res) {
  if(req.user) {
    res.redirect('/shots')
  }
  res.render('auth/login', { bodyClassTag: 'auth' });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/shots');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', ensureAuthentication, function(req, res){
  res.status(200).send("pong!");
});

router.get('/filter', function(req, res, next){
  var Shot = require('../models/shot');
  var filterList = []

  async.each(['os','de','wm'], function(item, callback) {
    Shot.aggregate(
      [
        { $group:
          { 
            _id: "$" + item,
            count: {$sum: 1},
          }
        },
        {$sort: {_id: 1}}
      ],
      function(err, list) {
        list.unshift({type:item})
        filterList.push(list)
        callback();
      }
    );
  }, function(err) {
    res.send(filterList)
  });
});

module.exports = router;
