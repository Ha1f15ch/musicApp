var Guest = require('../models/authGuest')
var Role = require('../models/role')
var UserProfile = require('../models/profileUser')
const validator = require('express-validator');
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const {secret} = require('./config')

generateJWT = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret, {
        expiresIn: "5h"
    })
};

//Регистрация GET
exports.reg_GET = function (req, res, next) {
    res.cookie('teestName', 'testValue')
    console.log(req.headers.cookie);
    res.render('registration', {
        title: 'Регистрация'
    });
}

//регистрация POST
exports.reg_POST = [
    validator.body('login', 'Поле Login пустое').trim().isLength({
        min: 4,
        max: 20
    }),
    validator.body('pass', 'Поле Password пустое').trim().isLength({
        min: 4,
        max: 10
    }),

    validator.sanitize('login').escape(),

   async (req, res, next) => {
        const errors = validationResult(req)
        ////////////////////////////////////////////

        if (!errors.isEmpty()) {
            res.render('registration', {
                title: 'Регистрация',
                errors: errors.array()
            })
            return;
        } else {
            const temp_Guest = await Guest.findOne({
                'login': req.body.login
            })
            console.log(temp_Guest)
            if (temp_Guest) {
                return res.status(400).json({
                    message: 'Пользователь с таким логином существует'
                })
            } else {
                const secret_pass = bcrypt.hashSync(req.body.pass, 5)
                const user_role = await Role.findOne({
                    value: "USER"
                })

                var GUEST = new Guest({
                    login: req.body.login,
                    pass: secret_pass,
                    role: [user_role.value]
                });

                GUEST.save(function (err) {
                    if (err) {
                        return next(err)
                    }
                    res.redirect(GUEST.url)
                    console.log('COOKIES:  ', req.cookies)
                    console.log('SIGNED COOKIES: ', req.signedCookies)
                })
                //return res.json({message: 'Пользователь успешно зарегистрирован'})
                var PROFILE = new UserProfile({
                    id_login_guest: GUEST._id,
                    FirstName: GUEST.login
                });
                
                PROFILE.save(function(err) {
                    if(err) {return next(err)}
                    console.log(PROFILE)
                })
                
            }
        }
    }
]

// exports.reg_post = async function(req, res) {
//     //res.send('Пока что не реализовано - регистрация_post')
//     try {
//         const errors = validationResult(req)
//         if(!errors.isEmpty()) {
//             return res.status(400).json({message: "Ошибка при регистрации: ", errors})
//         }
//         const {login, pass} = req.body
//         const temp_user = await Guest.findOne({login})
//         if(temp_user) {
//            /*  console.log(Guest.findOne({login}))
//             console.log('/////////////////////////////////////////////////////////')
//             console.log(temp_user) */
//             return res.status(400).json({messsge: 'Пользователь с таким логином уже зарегистрирован'})
//         }
//         const secret_pass = bcrypt.hashSync(pass, 5)
//         const user_role = await Role.findOne({value: "USER"})
//         const user = new Guest({login, pass: secret_pass, role: [user_role.value]})
//         user.save()
//         return res.json({message: 'Пользователь успешно зарегистрирован'})
//     } catch (e) {
//         console.log(e)
//         res.status(400).json({messsge: 'Ошибка при регистрации'})
//     }
// }

//Авторизация GET
exports.login_GET = function (req, res, next) {
    res.send('fijgskfjdhfgfkdjv')
}

//Aвторизация POST
exports.login_POST = async function (req, res) {
    //res.send('Войти_post - не реализовано')
    try {
        const {
            login,
            pass
        } = req.body
        const user = await Guest.findOne({
            login
        })
        if (!user) {
            return res.status(400).json({
                message: `Пользователь с тиким именем - ${login} не найден`
            })
        }
        const validPass = bcrypt.compareSync(pass, user.pass)
        if (!validPass) {
            return res.status(400).json({
                message: "Введен неверный пароль"
            })
        }
        const token = generateJWT(user._id, user.role)
        return res.json(token)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            messsge: 'Ошибка при входе'
        })
    }
}

//отобразить всех
exports.get_all = async function (req, res) {
    try {
        const users = await Guest.find()
        res.json(users)
        /* const uRole = new Role()
        const adminRole = new Role({value: "ADMIN"})
        uRole.save()
        adminRole.save() */
        //res.send('Получаем всех пользователей')
    } catch (e) {
        console.log(e)
    }
}