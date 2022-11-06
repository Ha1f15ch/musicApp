const jwt = require('jsonwebtoken')
const { secret } = require('../controller/config')

module.exports = function(role) {
    return function(req, res, next) {
        if(req.method === "OPTIONS") {
            next()
        }
    
        try {
            const token = req.headers.cookie.split('=')[1]
            if(!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {role: UserRole} = jwt.verify(token, secret)
            console.log('////////////////////////////////////////')
            console.log(UserRole)
            let isRole = false
            UserRole.forEach(rol => {
                if(role.includes(rol)) {
                    isRole = true
                }
            });
            if(!isRole) {
                return res.status(403).json({message: "У Вас не достаточнго прав для доступа"})
            }
            next()
        } catch(e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}