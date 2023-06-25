var MainPageController = require('../controller/MainPageController')
const {authJWT} = require('../middleware')
const {body} = require('express-validator')


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
//Home Page
    app.get('/home', [authJWT.verifytocen], MainPageController.showAll);
//My profile
    app.get('/myprofile', [authJWT.verifytocen], MainPageController.myProfileLoad_GET);
//Enter changes in profile myself
    app.get('/myprofile/update', [authJWT.verifytocen], MainPageController.UPDATEmyProfileLoad_GET)
    app.post('/myprofile/update', [
        authJWT.verifytocen,
        body('username', "Поле Username не может быть пустым, а также быть короче 4 и длиннее 20 символов")
            .isLength({min: 4, max: 20})
            .not(),
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
        body('FirstName')
            .trim()
            .isLength({min: 0, max: 15}).withMessage('Не более 15 символов')
            .isString().withMessage("В данном поле не должны присутствовать числа"),
        body('MidName')
            .trim()
            .isLength({min: 0, max: 15}).withMessage('Не более 15 символов')
            .isString().withMessage("В данном поле не должны присутствовать числа"),
        body('lastName')
            .trim()
            .isLength({min: 0, max: 15}).withMessage('Не более 15 символов')
            .isString().withMessage("В данном поле не должны присутствовать числа"),
        body('AboutUser')
            .isLength({min: 0, max: 100}).withMessage('Не более 100 символов')
    ], MainPageController.UPDATEmyProfileLoad_POST)
}
