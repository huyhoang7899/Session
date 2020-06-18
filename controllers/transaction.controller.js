const shortid = require('shortid');
const db = require('../db');

module.exports.index = function(req, res) {
  var userId = req.signedCookies.userId;
  var user = db.get('users').find({ id: userId}).value();
  var transactions = db.get('transactions').value();

  if (!user.isAdmin) {
    transactions = db.get('transactions').filter({ userId: userId }).value();
  }

  res.render('transaction/index', {
    transactions: transactions,
    user: user
  });
}

module.exports.create = function(req, res) {
  res.render('transaction/create', {
    users: db.get('users').value(),
    books: db.get('books').value()
  });
}

module.exports.update = function(req, res) {
  var userId = req.signedCookies.userId;
  var bookId = req.params.id;
  var transaction = db.get('transactions').find({ userId: userId }).value();

  var book = transaction.books.find(function(item) {
    return item.bookId = bookId
  });

  res.render('transaction/update', {
    transaction: transaction,
    book: book
  });
}

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get('transactions').remove({ id: id }).write();
  res.redirect('back');
}

module.exports.search = function(req, res) {
  var userId = req.signedCookies.userId;
  var user = db.get('users').find({ id: userId}).value();
  var q = req.query.q;
  var matchedTransaction = db.get('transactions').value();
  if(q) {
    matchedTransaction = db.get('transactions').value().filter(function(transaction) {
      return transaction.userId.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });
  }
  console.log(matchedTransaction)
  res.render('transaction/index', {
    transactions: matchedTransaction,
    q: q,
    user: user
  })
}

module.exports.postCreate = function(req, res) {
  var id = shortid.generate();
  var userId = req.signedCookies.userId;
  var books = [];

  req.body.isComplete = false;
  req.body.title = db.get('books').find({ id: req.body.bookId }).value().title;
  books.push(req.body)

  db.get('transactions').push({id: id, userId: userId, books: books}).write();
  res.redirect('/transactions');
}

module.exports.postUpdate = function(req, res) {
  var id = req.body.id;
  db.get('transactions').find({ id: id }).assign({ userId: userId }, { bookId: req.body.bookId }).write()
  res.redirect('/transactions');
}

module.exports.complete = function(req, res) {
  var id = req.params.id;

  db.get('transactions').find({ id: id }).assign({ isComplete: true }).write()
  res.redirect('/transactions');
}
