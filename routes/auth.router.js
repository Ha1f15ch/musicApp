const {verifySignUp} = require('../middleware')
const AuthController = require('../controller/authorization.controller')
const User = require('../models/user.model')
const {body} = require('express-validator')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/auth/signup', AuthController.signup_get)
    app.post('/auth/signup', [
        verifySignUp.checkDuplicateUserNameOrEmail, 
        verifySignUp.checkRoleExisted,
        body('username', "Поле Username не может быть пустым, а также быть короче 4 и длиннее 20 символов")
            .not()
            .isLength({min: 4, max: 20}),
        body('email', "Поле с Email не может быть пустым")
            .isEmail().withMessage('Это не Email')
            .normalizeEmail()
            .trim()
            .not()
            .custom(value => {
                return User.findOne(value).then(user => {
                    if(user) {
                        return Promise.reject('Введенный email уже использован');
                    }
                })
            }),
        body('pass', "Поле с паролем не может быть пустым, а также быть короче 6 и длиннее 12 символов")
            .trim()
            .isLength({min: 6, max: 12})
            .not()
            .isIn(['123', 'password', 'god', '123456', 'qwerty', 'qwertyu'])
            .withMessage('Не используйте простые пароли')
            .matches(/\d/)
    ], AuthController.sigup);

    app.get('/auth/signin', AuthController.signin_GET);
    app.post('/auth/signin', AuthController.signin);

    app.get('/auth/refreshToken', AuthController.refreshToken_GET);
    app.post('/auth/refreshToken', AuthController.refreshToken);
}