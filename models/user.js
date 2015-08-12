var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var _                     = require('lodash');
var shortid               = require('shortid');

var User = new Schema({
    username: String,
    password: String,
    avatar: {
      type: String,
      default: 'fetched-avatar_k3nii0.svg'
    },
    email: {
      type: String,
      unique: true,
      trim: true
    },
    fetchedKey: {
      type: String,
      unique: true,
      default: shortid.generate
    },
    shots : [{ type: Schema.Types.ObjectId, ref: 'Shot' }]
});

User.methods.toClient = function() {
  var user = _.pick(this, [
    'username', 
    'shots',
    'avatar',
    'cloudinary_url'
  ]);
  return user;
}

User.plugin(passportLocalMongoose, { usernameQueryFields : ['email'] });
module.exports = mongoose.model('User', User);