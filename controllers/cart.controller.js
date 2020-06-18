var db = require('../db');
const shortid = require('shortid');

module.exports.index = function(req, res) {
  var sessionId = req.signedCookies.sessionId;
  var items = db.get('sessions').find({ id: sessionId }).value().cart;

  var booksItem = []
  for(var item in items) {
    var book = db.get('books').find({ id: item }).value();
    var bookCopy = Object.assign({}, book);
    bookCopy.amount = items[item];
    booksItem.push(bookCopy);
  }

  res.render('cart/index', {
    booksItem: booksItem
  });
}

module.exports.addToCart = function(req, res) {
  var bookId = req.params.bookId;
  var sessionId = req.signedCookies.sessionId;

  if(!sessionId) {
    res.redirect('/books');
    return;
  }

  var count = db
  .get('sessions')
  .find({ id: sessionId})
  .get('cart.' + bookId, 0)
  .value();

  db.get('sessions')
  .find({ id: sessionId})
  .set('cart.' + bookId, count + 1)
  .write();

  res.redirect('/books')

};

module.exports.rental = function (req, res) {
  var id = shortid.generate();
  var userId = req.signedCookies.userId;
  var sessionId = req.signedCookies.sessionId;
  var items = db.get('sessions').find({ id: sessionId }).value().cart;

  var transaction = []
  for(var item in items) {
    var book = db.get('books').find({ id: item }).value();
    var bookCopy = Object.assign({}, book);
    bookCopy.isComplete = false;
    bookCopy.amount = items[item];
    bookCopy.bookId = book.id;
    delete bookCopy.id;
    delete bookCopy.coverUrl;
    delete bookCopy.description;
    transaction.push(bookCopy);
  }

  db.get('transactions').push({id: id, userId: userId, books: transaction}).write();

  res.clearCookie("sessionId");

  res.redirect('/transactions');

}
