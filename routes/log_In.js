var express = require('express')
var router = express.Router();
const {check} = require('express-validator')
var GuestController = require('../controller/GuestsController');
const authMidleware = require('../middleware/authMidleware')
const roleMidleware = require('../middleware/roleMidleware')

//Вход GET
router.get('/in', GuestController.login_GET)

//Вход POST
router.post('/in', GuestController.login_POST);

module.exports = router;