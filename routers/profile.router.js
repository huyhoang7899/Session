var express = require('express');
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var controller = require('../controllers/profile.controller');

var router = express.Router();

router.get('/', controller.index);

router.get('/avatar', controller.avatar);

router.post('/avatar', upload.single('avatar'), controller.postAvatar);

module.exports = router;
