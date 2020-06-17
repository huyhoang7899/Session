var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });

var controller = require('../controllers/book.controller');
var authMiddleware = require('../middlewares/admin.middleware');

var router = express.Router();

router.get('/', controller.index);

router.get('/create', authMiddleware.requireAdminBook, controller.create);

router.get('/:id/update', authMiddleware.requireAdminBook, controller.update);

router.get('/:id/delete', authMiddleware.requireAdminBook, controller.delete);

router.get('/search', controller.search);

router.post('/create', upload.single('avatar'), controller.postCreate);

router.post('/update', controller.postUpdate);

module.exports = router;
