const shortid = require('shortid');

var db = require('../db');

module.exports.index = function(req, res) {
  res.render('books/index',{
   books: db.get('books').value(),
   user: db.get('users').find({ id: req.signedCookies.userId}).value()
  });
}

module.exports.create = function(req, res) {
  res.render('books/create');
}

module.exports.update = function(req, res) {
  var id = req.params.id;
  var book = db.get('books').find({ id: id }).value();
  res.render('books/update', {
    book: book
  });
}

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get('books').remove({ id: id }).write();
  res.redirect('back');
}

module.exports.search = function(req, res) {
  var q = req.query.q;
  var userId = req.signedCookies.userId;
  var user = db.get('users').find({ id: userId}).value();
  var matchedBook = db.get('books').value();
  if(q) {
    matchedBook = db.get('books').value().filter(function(book) {
      return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
  }
  res.render('books/index', {
    books: matchedBook,
    q: q,
    user: user
  });
}

module.exports.postCreate = function(req, res) {
  var pathBookCover = req.file.path;
  var cloudinary = require('cloudinary');

  cloudinary.config({
    cloud_name: process.env.SESSION_CLOUD_NAME,
    api_key: process.env.SESSION_API_KEY,
    api_secret: process.env.SESSION_API_SECRET
  });

  cloudinary.v2.uploader.upload(pathBookCover, function(error, result) {
    req.body.id = shortid.generate();
    req.body.coverUrl = result.url;
    db.get('books').push(req.body).write();
    res.redirect('/books');
  });
}

module.exports.postUpdate = function(req, res) {
  var id = req.body.id;
  db.get('books').find({ id: id }).assign({ title: req.body.title, description: req.body.description}).write();
  res.redirect('/books');
}
