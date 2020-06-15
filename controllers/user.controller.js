var db = require('../db');
const shortid = require('shortid');

module.exports.index = function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var drop = (page - 1) * perPage;
  var users = db.get('users').drop(drop).take(perPage).value();
  var totalPage = Math.ceil(db.get('users').value().length / perPage);

  res.render('users/index', {
    users: users,
    userLogin: db.get('users').find({ id: req.signedCookies.userId}).value(),
    nextPage: page + 1,
    prePage: page - 1,
    totalPage: totalPage,
    page: page
  });
}

module.exports.create = function(req, res) {
  res.render('users/create');
}

module.exports.views = function(req, res) {
  var id = req.params.id;
  var user = db.get('users').find({ id: id }).value();
  res.render('users/views', {
    user: user
  })
}

module.exports.update = function(req, res) {
  var id = req.params.id;
  var user = db.get('users').find({ id: id }).value();
  res.render('users/update', {
    user: user
  })
}

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get('users').remove({ id: id }).write();
  res.redirect('back');
}

module.exports.search = function(req, res) {
  var q = req.query.q;
  var userId = req.signedCookies.userId;
  var user = db.get('users').find({ id: userId}).value();
  var matchedUser = db.get('users').value();
  if(q) {
    matchedUser = db.get('users').value().filter(function(user) {
			return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
		});
  }
  res.render('users/index', {
    users: matchedUser,
    q: q,
    userLogin: user
  })
}

module.exports.postCreate = function(req, res) {
  req.body.id = shortid.generate();

  db.get('users').push(req.body).write();
  res.redirect('/users');
}

module.exports.postUpdate = function(req, res) {
  var id = req.body.id;
  db.get('users').find({ id: id }).assign({ name: req.body.name, age: req.body.age, address: req.body.address, phone: req.body.phone }).write();
  res.redirect('/users');
}
