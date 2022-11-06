const jwt = require('jsonwebtoken')
const { secret } = require('../controller/config')

module.exports = function(req, res, next) {
    if(req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.cookie.split('=')[1]
        console.log(token);
        //console.log(`Запись о JSONWEB tokenme ${token}`)/* req.headers.authorization.split(' ')[1] */
        if(!token) {
            res.status(403).redirect('/login')/* .json({message: "Пользователь не авторизован"}) */
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next()
    } catch(e) {
        console.log(e);
        const token = req.headers.cookie.split('=')[2]
        console.log(`TOKEN - ${token} POL'ZOVATELYA USTAREL ILI NE NAIDEN`)
        res.status(403).redirect('/login')/* .json({message: "Пользователь не авторизован"}) */
    }
}