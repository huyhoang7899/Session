var express = require('express');
var authMiddleware = require('../middlewares/auth.middleware');

var controller = require('../controllers/cart.controller');

var router = express.Router();

router.get('/', controller.index);

router.get('/add/:bookId', controller.addToCart);

router.get('/rental',authMiddleware.requireAuth, controller.rental);

module.exports = router;
