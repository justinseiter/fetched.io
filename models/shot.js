var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var shortid  = require('shortid');
var _        = require('lodash');
var mongoosePaginate = require('mongoose-paginate');

var Shot = new Schema({
  shortId: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  _shooter : { type: Schema.Types.ObjectId, ref: 'User' },
  fans     : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: {
    type: Date,
    default: Date.now
  },
  colors: [Schema.Types.Mixed],
  os: {
    type: String,
    default: 'Undefined',
    trim: true
  },
  osVer: {
    type: String,
    default: '',
    trim: true
  },
  osCodeName: {
    type: String,
    default: '',
    trim: true
  },
  kernel: String, 
  uptime: String,
  packages: Number,
  shell: String,
  shellVer: String,
  resolution: {
    type: String,
    default: 'Not Found'
  },
  de: String,
  deVer: String,
  wm: String,
  wmTheme: String,
  gtk2Theme: String,
  gtk3Theme: String,
  gtkThemeVer: String,
  gtkTheme: String,
  iconTheme: String,
  font: String,
  fontSize: String,
  cpu: String,
  gpu: String,
  ram: String,
  originalName: String,
  cloudinary_public: String,
  cloudinary_url: String,
});

Shot.methods.toClient = function() {
  var shot = _.pick(this, [
    'shortId',
    'created', 
    '_shooter',
    'colors',
    'fans',
    'os', 
    'osVer',
    'osCodeName',
    'kernel', 
    'uptime', 
    'packages', 
    'shell', 
    'resolution', 
    'de', 
    'deVer',
    'wm',
    'wmTheme', 
    'gtkTheme', 
    'gtkThemeVer',
    'iconTheme',
    'font',
    'fontSize',
    'cpu',
    'gpu',
    'ram',
    'cloudinary_public',
    'cloudinary_url'
  ]);
  shot.id = this._id;
  return shot;
}

Shot.plugin(mongoosePaginate);

module.exports = mongoose.model('Shot', Shot);