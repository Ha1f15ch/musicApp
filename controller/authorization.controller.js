const config = require('./config')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const refreshToken = require('../models/refreschToken.model')
const UserProfile = require('../models/profileUser')
const {validationResult} = require('express-validator')

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

//Registration GET
exports.signup_get = function(req, res, next) {
    res.render('registration', {title: 'Регистрация'})
}

//registration POST
exports.sigup = [
    
    async (req, res, next) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty()) {
            res.render('registration', {
                title: 'Регистрация',
                errorsMSG: errors.array()
            })
            return;
        } else {
            const loginUser = await User.findOne({
                username: req.body.username
            })
            const emailUser = await User.findOne({
                email: req.body.email
            })
            if(loginUser) {
                return res.render('registration', {
                    title: 'Регистрация',
                    message: "Пользователь с таким именем уже зарегистрирован!"
                })
            } else if(emailUser) {
                return res.render('registration', {
                    title: 'Регистрация',
                    message: "Пользователь с таким email уже зарегистрирован!"
                })
            } else {
                const userPass = bcrypt.hashSync(req.body.pass, 5)
                const userRole = await Role.findOne({
                    value: "ADMIN"
                })

                var USER = new User({
                    username: req.body.username,
                    email: req.body.email,
                    pass: userPass,
                    role: [userRole.value]
                })
                
                USER.save(function(err) {
                    if(err) {
                        return next(err)
                    }
                    res.redirect('/auth/signin')
                })

                var PROFILE = new UserProfile({
                    id_login_guest: USER._id
                })

                PROFILE.save(function(err) {
                    if(err) {
                        return next(err)
                    }
                })
            }
        }
    }
];

//authorization GET
exports.signin_GET = (req, res, next) => {
    res.render('authorization', {
        title: 'Вход'
    })
}

//authorization POST
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
    .populate("role", "-__v")
    .exec(async (err, user) => {
        if(err) {
            res.status(500).send({message: err})
            return
        }
        if(!user) {
            return res.status(404).send({message: 'Пользователь не найден!!'})
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.pass,
            user.pass
        );

        if(!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Не правильный пароль!'
            });
        }

        var token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        let refreschToken = refreshToken.createToken(user);
        console.log('REFRESCHTOKEN___ ' + refreschToken)

        var authorities = [];

        for(let i = 0; i < user.role.length; i++) {
            authorities.push("ROLE_" + user.role[i].value.toUpperCase());
        }
        /* res.status(200) */
        res.cookie('token', token)
        res.setHeader("x-access-token", token)
        
        console.log({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreschToken,
        })
        res.redirect('/home')
    });
};

//GET
exports.refreshToken_GET = (req, res, next) => {
    res.render('tempPageLoad', {
        title: 'Обновляем',
        dataError: 'Обновляем данные'
    });
}

//POST
exports.refreshToken = async (req, res) => {

    tempValtoken = req.headers.cookie.split('token=')[1]

    console.log(tempValtoken)
    if(tempValtoken == null) {
        console.log('Ошбика верификации токена доступа! Токен доступа отсутствует, проверьте настройки куки, авторизуйтесь повторно на сайте')
        return res.status(403).redirect('/auth/signin')
    }

    try {

        let parseTempValToken = tempValtoken.split('.')[1]
        let decode64ParseTempValToken = parseTempValToken.replace(/-/g, '+').replace(/_/g, '/'); //base64
        let decodedToken = JSON.parse(Buffer.from(decode64ParseTempValToken, 'base64').toString('binary'))

        console.log(decodedToken.id + ' - 148 строка файла сонтроллера авторизации')

        const tokenVerifie = await refreshToken.findOne({ 'user': decodedToken.id })// ++ error //refreshToken //63a36bcd0bf1e2ce49ccb81b
            console.log(tokenVerifie + ' - TOKEN VERIFIE')

            if(!tokenVerifie) {
                return res.status(403).redirect('/auth/signup');/* json({message: 'Такого токена нет в БД!!'}); */
            }

            if(refreshToken.verifyExpiration(tokenVerifie)) {
                await refreshToken.findByIdAndRemove(tokenVerifie._id, {useFindAndModify: false}).exec();
                console.log('Токен REFRESCH устарел!!')
                return res.status(403).redirect('/auth/signin');
            }

            let newAccessToken = jwt.sign({id: decodedToken.id}, config.secret, {
                expiresIn: config.jwtExpiration,
            });

            let tempHeaderBeforeAdress = req.get('Referer')
            console.log(tempHeaderBeforeAdress + ' - прошлый адрес')
            res.cookie('token', newAccessToken)
            return res.status(200).redirect('/home')
            
    } catch(e) {
        return res.status(500).send({message: e});
    }
};