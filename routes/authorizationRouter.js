var express = require('express');
var router = express.Router();

const user_authorization_controller = require('../controllers/users.authorization.controller')

router.get('/', user_authorization_controller.authorization_menu)

router.post('/signUp', user_authorization_controller.sign_up)

router.post('/login', user_authorization_controller.log_In)

router.get('/logOut', user_authorization_controller.log_out)

module.exports = router;