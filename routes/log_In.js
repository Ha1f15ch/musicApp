var express = require('express')
var router = express.Router();
const {check} = require('express-validator')
var GuestController = require('../controller/GuestsController');
const authMidleware = require('../middleware/authMidleware')
const roleMidleware = require('../middleware/roleMidleware')

//default
router.get('/', function(req, res, next) {
    res.redirect('/login')
})

//Вход GET
router.get('/login', GuestController.login_GET)

//Вход POST
router.post('/login', GuestController.login_POST);

module.exports = router;