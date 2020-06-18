const db = require('../db');

module.exports.complete = function(req, res, next) {
  var userId = req.params.userId;
  var transaction = db.get('transactions').find({ userId: userId }).value();
  if (!transaction) {
     res.render('transaction/index', {
      transactions: db.get('transactions').value(),
      error: "Not found ID in transactions !"
      });
  }
  next();
}
