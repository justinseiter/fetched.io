var express              = require('express');
var passport             = require('passport');
var ensureAuthentication = require('../middleware/ensureAuthentication');
var User                 = require('../models/user');
var Shot                 = require('../models/shot');
var router               = express.Router();

// GET users listing by username
router.get('/:username', function(req, res, next) {
  var username = req.params.username;
  User.findOne({ username: username }).populate({ path: 'shots', options: {sort: {created: -1}}}).exec(function(err, user){
    if(err) {
      return res.render('error');
    }
    if(!user) {
      return res.render('404');
    }

    // Pass user toClient method to protect sensitive data
    res.render('users/view', {user:user.toClient()});
  });
});

// GET edit view
router.get('/:username/edit', ensureAuthentication, function(req, res) {
  var username = req.params.username;
  User.findOne({ username: username }, function(err, user){
    if(err) {
      return res.render('error');
    }
    if(!user) {
      return res.render('404');
    }
    res.render('users/edit', {user: user});
  });
});

// POST edit user
router.post('/editUser', ensureAuthentication, function(req, res){
  var query = { username: req.body.username }
  var update = {
    avatar: req.body.avatar,
    password: req.body.password,
    newPassword: req.body.newPassword,
    email: req.body.email
  }

  // Check to see if new password fields match
  if(update.newPassword) {
    if(update.password === update.newPassword){
      var updatedPassword = update.password
    } else {
      console.log("Passwords do not match")
    }
  }
  User.findOne(query,function(err, user){
    if(err) {
      return res.render('error');
    }
    user.email = update.email;
    user.avatar = update.avatar;
    if(!updatedPassword) {
      user.save();
    } else {

      // If password changed, pass updatePassword method
      user.setPassword(updatedPassword, function(err, user){
        if(err) {
          res.send(err)
        }
        user.save();
      });
    }
    res.redirect('/users/' + req.body.username)
  });
});

module.exports = router;
