var express = require('express');
const { check } = require('express-validator');
var router = express.Router();
var GuestController = require('../controller/GuestsController');
const authMidleware = require('../middleware/authMidleware')
const roleMidleware = require('../middleware/roleMidleware')

router.get('/', function(req, res, next) {
    res.redirect('/registration')
})

//Регистрация метод GET
router.get('/registration', GuestController.reg_GET)

//Регистрация метод POST
router.post('/registration', GuestController.reg_POST)
// [
//     check('login', "логин не может быть пустым").notEmpty(),
//     check('pass', "пароль не может быть короче 4 и длинее 10 символов").isLength({min:4, max: 10})
// ],

//Тостовый вариант для GET запросов
router.get('/all', roleMidleware(['ADMIN']), GuestController.get_all);

module.exports = router;
