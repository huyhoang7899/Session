var db = require('../db');

module.exports.index = function(req, res) {
  var id = req.signedCookies.userId;
  var user = db.get('users').find({ id: id}).value();
   if(!user.avatarUrl) {
    db.get('users')
    .find({ id: id})
    .set('avatarUrl', 'https://res.cloudinary.com/huyhoang/image/upload/v1592217733/qrsdkpnljrtvg52crqzh.png')
    .write();
   }
  res.render('./profile/index.pug', {
    user: user
  });
}

module.exports.avatar = function(req, res) {
  var id = req.signedCookies.userId;
  var user = db.get('users').find({ id: id}).value();
  res.render('./profile/avatar.pug', {
    user: user
  });
}

module.exports.postAvatar = function(req, res) {
  req.body.pathAvatar = req.file.path;
  var id = req.signedCookies.userId;
  var cloudinary = require('cloudinary');
  var user = db.get('users').find({ id: id}).value();

  cloudinary.config({
    cloud_name: process.env.SESSION_CLOUD_NAME,
    api_key: process.env.SESSION_API_KEY,
    api_secret: process.env.SESSION_API_SECRET
  });

  cloudinary.v2.uploader.upload(req.body.pathAvatar, function(error, result) {
    db.get('users')
    .find({ id: id })
    .assign({ avatarUrl: result.url })
    .write();
  });

  res.redirect('/profile');
}
