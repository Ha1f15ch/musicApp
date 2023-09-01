const jwt = require('jsonwebtoken');
const {secret} = require('../models/configSettings')
const Users = require('../models/users.model')

module.exports = async (req, res, next) => {
    if(req.method == "OPTIONS") {
        next()
    }

    try {

        if(req.headers.cookie) {
            var token = req.headers.cookie.split('access_token=')[1]
            jwt.verify(token, secret, (errorVerify, resultVerify) => {
                if(errorVerify) {
                    console.log('При верификации пользователя по пути возникла ошибка - токен access пророчен')
                    res.status(404).redirect('/v1/api/authorization/login')
                }
                if(resultVerify) {
                    console.log('Верификация access токена прошла успешно')
                    req.userIds = resultVerify.id
                    console.log(req.userIds, ' - записываем в хэдеры id пользователя')
                    next();
                }
                //По идее нужен обработчик попытки генерации нового токена
            })
        } else {
            res
            .status(403)
            .redirect('/v1/api/authorization/login')
        }
    } catch(e) {
        console.log(e)
        next(e)
    }
}