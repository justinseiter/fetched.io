var express              = require('express');
var passport             = require('passport');
var User                 = require('../models/user');
var Shot                 = require('../models/shot');
var router               = express.Router();
var cloudinary           = require('cloudinary');
var async                = require('async');
var fs                   = require('fs');
var multer               = require('multer');
var upload               = multer({ dest: './uploads/' })
var ensureAuthentication = require('../middleware/ensureAuthentication')
var _                    = require('lodash');
var paginate             = require('express-paginate');

router.get('/', function (req, res, next){
  var query = {};
  var filter = req.query.filter;
  var q = req.query.q
  if(filter) {
    query[filter] = q;
  }
  Shot.paginate(query, { page: req.query.page, limit: req.query.limit, populate: [ { path:'_shooter', select:'username avatar'}] , sortBy: {created: -1} }, function(err, shots, pageCount, itemCount) {
    if (err) return next(err);
    res.format({
      html: function() {
        res.render('shots/index', {
          shots: shots,
          filter: filter,
          q:q,
          pageCount: pageCount,
          itemCount: itemCount
        });
      },
      json: function() {
        // inspired by Stripe's API response for list objects
        res.json({
          object: 'list',
          has_more: paginate.hasNextPages(req)(pageCount),
          data: shots
        });
      }
    });
  });
});

router.get('/:shotId', function(req, res){
  var shotId = req.params.shotId;
  if(!shotId) {
    return res.sendStatus(400);
  }
  Shot
  .findById(shotId)
  .populate('_shooter fans', {avatar:'_shooter.avatar', username:'_shooter.username'})
  .lean()
  .exec(function (err, shot) {
    if (err) {
      return err;
    }
    if(!shot) {
      return res.sendStatus(404);
    }
    var likeCount = shot.fans.length;
    res.render('shots/view', { shot:shot, likeCount:likeCount })
  });
});

router.post('/:shotId/like', ensureAuthentication, function(req, res){
  var shotId = req.params.shotId;
  var fan = req.body.fan;
  var isFan = req.body.liked;
  var shooter = req.body.shooter;
  Shot.findById(shotId, function(err, shot){
    if(err) {
      return res.sendStatus(500);
    }
    if(isFan != 0) {
      shot.fans.push(fan);
      isFan = 0;
    } else {
      var removeLike = shot.fans.indexOf(fan);
      shot.fans.splice(removeLike, 1);
      isFan = -1;
    }
    shot.save();
    var likeCount = shot.fans.length;
    res.send({likeCount:likeCount, isFan:isFan});
  });
});



router.delete('/:shotId', ensureAuthentication, function(req, res, next){
  var shotId = req.params.shotId;
  if(!shotId) {
    return res.sendStatus(400);
  }
  async.waterfall([
    function(callback) {
      Shot.findById(shotId, function(err, shot){
        if(err) {
          return res.sendStatus(500);
        }
        if(!shot) {
          return res.sendStatus(404 + ' Sorry, could not find a shot with that ID.');
        }
        callback(null, shot);
      });
    },
    function(shot, callback) {
      cloudinary.api.delete_resources(shot.cloudinary_public, function(result){
        callback(null, shot);
      });
    },
    function(shot, callback) {
      User
      .findById(shot._shooter)
      .exec(function (err, user) {
        if (err) {
          return next(err)
        }
        var userShots = user.shots;
        var killShot = userShots.indexOf(shot._id);
        userShots.splice(killShot, 1);
        user.save();
        callback(null, shot);
      });
    }
  ],
  function(err, shot){
    if (err) {
      // If an error occured, we let express/connect handle it by calling the "next" function
      return next(err);
    }
    Shot.remove(shot, function(err){
      if(err) {
        return res.sendStatus(500);
      }
      res.redirect('/shots');
    });
  });

});

router.post('/', upload.single('file'), function(req, res, next){
  var shot = req.body;
  var image = req.file;

  shot.originalName = image.originalname;

  function filterData(str, callback) {
    var fdata = {};
    if(str == 'Not Found') {
      fdata.name = 'Not Found';
      fdata.number = '';
    } else if(str == 'Not Present') {
      fdata.name = 'Not Present';
      fdata.number = '';
    } else {
      var splitAry = str.split(' ');
      var parsed = [];
      for(var i = 0; i < splitAry.length; i++){
        parsed.push(splitAry[i])
      }
      if(parsed.length > 1) {
        fdata.number = parsed.pop();
      }
      fdata.name = parsed.join(' ');
    }
    callback(fdata);
  }

  filterData(shot.font, function(data){
    shot.font = data.name;
    shot.fontSize = data.number;
  });

  filterData(shot.de, function(data){
    shot.de = data.name;
    shot.deVer = data.number;
  });

  filterData(shot.shell, function(data){
    shot.shell = data.name;
    shot.shellVer = data.number;
  });

  if(shot.gtk2Theme == shot.gtk3Theme) {
    if(shot.gtk2Theme == "Not Found") {
      shot.gtkThemeVer = ""
    }
    shot.gtkThemeTitle = shot.gtk3Theme;
    shot.gtkThemeVer = "2/3"
  } else if(shot.gtk2Theme == "Not Found") {
    shot.gtkThemeTitle = shot.gtk3Theme;
    shot.gtkThemeVer = "3"
  } else if(shot.gtk3Theme == "Not Found") {
    shot.gtkThemeTitle = shot.gtk2Theme;
    shot.gtkThemeVer = "2"
  } else {
    shot.gtkThemeTitle = shot.gtk2Theme + shot.gtk3Theme
  }

  async.waterfall([
    // Upload image to Cloudinary
    function(callback) {
      cloudinary.uploader.upload(image.path, function(result){
        shot.cloudinary_public = result.public_id;
        shot.cloudinary_url = result.url;
        shot.colors = result.colors;
        callback();
      }, {
            eager: [
              { width: 400, height: 225, crop: 'fill', format: 'png' },
              { width: 1200, crop: 'fit', format: 'png' }
            ],                                     
            eager_async: true,
            colors: true
      });
    },
    // Remove tmp file from uploads
    function(callback) {
      fs.unlink('./uploads/' + image.filename, function (err) {
        if (err) {
          return next(err);
        }
        callback();
      });
    },
    function(callback) {
      User.findOne({ fetchedKey:shot.fetchedKey }, function(err, user){
        if(err) {
          return res.sendStatus(500);
        }
        if(!user) {
          return res.sendStatus(404);
        }
        shot._shooter = user._id;
        callback(user);
      });
    }
    ],
    function(user,err) {
      if(err) {
        return next(err);
      }
      Shot.create(shot, function(err, shot){
        if(err) {
          // return res.sendStatus(500);
          return res.status(500).send(err)
        }
        user.shots.push(shot)
        user.save();
        res.send({shot:shot});
      });
    }
  );
});

module.exports = router;