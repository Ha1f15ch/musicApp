const async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model.js');
const Rights = require('../models/rights.model');
const RefreschToken = require('../models/tokens.model');
const {secret} = require('../models/configSettings');
const {jwtExpiration} = require('../models/configSettings');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.authorization_menu = async (req, res, next) => {
    res.send('show menu for authorization')
}

exports.sign_up = [
    async (req, res, next) => {
        var login_Section = await Users.find({
            login: req.body.login
        })
        var email_section = await Users.find({
            email: req.body.email
        })
        
        var roles_system = await Roles.find({
            name: 'sysUser'
        })

        if(login_Section == req.body.login || email_section == req.body.email) {
            console.log('Введенные данные уже использовались, попробуйте авторизоваться')
            res.status(400).send('Введенные данные уже использовались, попробуйте авторизоваться')
        } else {
            const sicretPass = bcrypt.hashSync(req.body.pass, 7)

            var user = new Users({
                login: req.body.login,
                email: req.body.email,
                pass: sicretPass,
                role: roles_system
            });

            await user.save()
            .then((results_user) => {
                console.log(results_user, 'выполнено корректно')
                var userProfile = new UserProfile({
                    idUser: results_user._id
                });

                let token = jwt.sign({id: results_user._id}, secret, {
                    expiresIn: jwtExpiration
                });

                let refreschToken = RefreschToken.createToken(results_user._id)

                userProfile.save()
                .then((results_userProfile) => {
                    console.log('Выполнено корректно - ', results_userProfile)
                    res
                    .cookie('access_token', token, {
                        httpOnly: true,
                        secure: true
                    })
                    .redirect('/v1/api/myProfile')
                })
                .catch((errors_userProfile) => {
                    console.log('errors_userProfile - ', errors_userProfile)
                    return next(errors_userProfile)
                })
            })
            .catch((errors_user) => {
                console.log('errors_user - ', errors_user)
                return next(errors_user)
            })
        }
    }
];

exports.log_In = [
    async (req, res, next) => {

        var findUserId = await Users.findOne({
            login: req.body.login
        })
        .then((resultsUser) => {
            if(resultsUser == [] || resultsUser.login != req.body.login) {
                console.log(resultsUser, ' - неверные данные в логине')
                return res.status(400).send('Неверно введен логин')
            } else {
                console.log(resultsUser, '00')
                if(bcrypt.compareSync(req.body.pass, resultsUser.pass)) {
                console.log('Пароль совпадает, 1')

                if(req.headers.cookie) {
                    console.log('Есть данные cookie, 2')
                    var token = req.headers.cookie.split('access_token=')[1]
                    var valToken = token.split('.')[1]
                    var parsToken = valToken.replace(/-/g, '+').replace(/_/g, '/');
                    var decodedToken = JSON.parse(Buffer.from(parsToken, 'base64').toString('binary'));
                    const newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                        expiresIn: jwtExpiration,
                    });
                    jwt.verify(token, secret, async (errorVerify, resultVerify) => {
                        if(errorVerify) {
                            console.log(`access token некорректен, 8, ${token}`, errorVerify)
                            console.log(`Будет записан новый - ${newAccessToken}`)
                            RefreschToken.findOne({
                                userId: decodedToken.id
                            })
                            .then((resultsRefToken) => {
                                if(RefreschToken.verifyExpiration(resultsRefToken)) {
                                    console.log('Удаляем старый токен - ', resultsRefToken, 9)
                                    RefreschToken.findByIdAndRemove(resultsRefToken._id, {useFindAndModify: false})
                                    /* var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                                        expiresIn: jwtExpiration,
                                    }); */
                                    const newReftoken = RefreschToken.createToken(resultsUser._id)
                                    console.log('Создаем новй токен - ', newReftoken, 10)
                                    res
                                    .cookie('access_token', newAccessToken, {
                                        httpOnly: true,
                                        secure: true
                                    })
                                    .redirect('/v1/api/main')
                                } else {
                                    res
                                    .cookie('access_token', newAccessToken, {
                                        httpOnly: true,
                                        secure: true
                                    })
                                    .redirect('/v1/api/main')
                                }
                            })
                            .catch(async (errorRefToken) => {
                                console.log('refresh токена нет, 11', errorRefToken)
                                const newReftoken = await RefreschToken.createToken(resultsUser._id)
                                console.log('Создаем новй токен - ', newReftoken, 12)
                                /* var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                                    expiresIn: jwtExpiration,
                                }); */
                                res
                                .cookie('access_token', newAccessToken, {
                                    httpOnly: true,
                                    secure: true
                                })
                                .redirect('/v1/api/main')
                            })
                        }
                        if(resultVerify) {
                            console.log('access token - корректен, ', 3)
                            await RefreschToken.findOne({
                                userId: resultsUser._id
                            })
                            .then(async (resultsRefToken) => {
                                if(RefreschToken.verifyExpiration(resultsRefToken)) {
                                    console.log('Удаляем старый токен - ', resultsRefToken, 4)
                                    await RefreschToken.findByIdAndRemove(resultsRefToken._id, {useFindAndModify: false})
                                    .then((resDeleted) => {
                                        console.log('Удаление прошло успешно - ', resDeleted)
                                    })
                                    .catch((errDeleted) => {
                                        console.log(errDeleted, ' - Ошибка при удалении refreschTokent-а')
                                    })
                                    const newReftoken = await RefreschToken.createToken(resultsUser._id)
                                    console.log('Создаем новй токен - ', newReftoken, 5)
                                    res
                                    .cookie('access_token', token, {
                                        httpOnly: true,
                                        secure: true
                                    })
                                    .redirect('/v1/api/main')
                                } else {
                                    console.log('Текущий refresh token валиден - ', resultsRefToken)
                                    res
                                    .cookie('access_token', token, {
                                        httpOnly: true,
                                        secure: true
                                    })
                                    .redirect('/v1/api/main')
                                }
                            })
                            .catch((errorRefToken) => {
                                console.log(errorRefToken)
                                console.log('refresh токена нет, 6')
                                const newReftoken = RefreschToken.createToken(resultsUser._id)
                                console.log('Создаем новй токен - ', newReftoken, 7)
                                console.log(req.headers.cookie)
                                res
                                .cookie('access_token', token, {
                                    httpOnly: true,
                                    secure: true
                                })
                                .redirect('/v1/api/main')
                            })
                        } 
                    })                    
                } else {
                    console.log('данных cookie нет, 13')
                    var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                        expiresIn: jwtExpiration,
                    })
                    console.log('Создаем новй токен access', newAccessToken, 14)
                    RefreschToken.findOne({
                        userId: resultsUser._id
                    })
                    .then(async (resultsRefToken) => {
                        if(RefreschToken.verifyExpiration(resultsRefToken)) {
                            var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                                expiresIn: jwtExpiration,
                            })
                            console.log('Удаляем старый токен - ', resultsRefToken, 15)
                            await RefreschToken.findByIdAndRemove(resultsRefToken._id, {useFindAndModify: false})
                            const newReftoken = await RefreschToken.createToken(resultsUser._id)
                            console.log('Создаем новй токен - ', newReftoken, 16)
                            res
                            .cookie('access_token', newAccessToken, {
                                httpOnly: true,
                                secure: true
                            })
                            .redirect('/v1/api/main')
                        } else {
                            var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                                expiresIn: jwtExpiration,
                            })
                            res
                            .cookie('access_token', newAccessToken, {
                                httpOnly: true,
                                secure: true
                            })
                            .redirect('/v1/api/main')
                        }
                    })
                    .catch((errorRefToken) => {
                        var newAccessToken = jwt.sign({id: resultsUser._id}, secret, {
                            expiresIn: jwtExpiration,
                        })
                        console.log('refresh токена нет, 17')
                        const newReftoken = RefreschToken.createToken(resultsUser._id)
                        console.log('Создаем новй токен - ', newReftoken, 18)
                        res
                        .cookie('access_token', newAccessToken, {
                            httpOnly: true,
                            secure: true
                        })
                        .redirect('/v1/api/main')
                    })
                }

            } else {
                console.log('пароль не подходит')
                return res.status(400).send('Неверно введен пароль')
            }
            }
        })
        .catch((errorsuser) => {
            console.log(errorsuser)
            return res.status(400).send('Неверно введен логин')
        })
    }
];

exports.log_out = [
    async (req, res, next) => {
        try{
            let token = req.headers.cookie.split('access_token=')[1]
            console.log(token)
            if(token == 'undefined') {
                res.redirect('/v1/api/main')
            } else {
                let valToken = token.split('.')[1]
                let parsToken = valToken.replace(/-/g, '+').replace(/_/g, '/');
                var decodedToken = JSON.parse(Buffer.from(parsToken, 'base64').toString('binary')); 

                await RefreschToken.findOneAndDelete({
                    userId: decodedToken.id
                })
                .then((resDelete) => {
                    console.log('Удаляется refresch token - ', resDelete)
                    res
                    .clearCookie('access_token', {
                        httpOnly: true
                    })
                    .redirect('/v1/api/main')
                })
                .catch((errDelete) => {
                    console.log(errDelete)
                    return next(errDelete)
                })
            }
            
            
            /* req.headers.cookie.split('access_token=')[1] = undefined */
            
        } catch(e) {
            console.log(e)
            return next(e)
        }        
    }
]