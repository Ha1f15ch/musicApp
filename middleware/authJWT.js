const jwt = require('jsonwebtoken')
const config = require('../controller/config')
const Role = require('../models/role.model')
const User = require('../models/user.model')

const {TokenExpiredError} = jwt;

const catchError = (err, res) => {
    if(err instanceof TokenExpiredError) {
        res.redirect('/auth/refreshToken')
    }
}

const verifytocen = (req, res, next) => {
    if(req.headers.cookie === undefined) {
        return res.status(500).redirect('/auth/signin')
    }
    let tempValTokenHeader = req.headers.cookie.split('token=')[1]
    let token = tempValTokenHeader;
    if(!token) {
        return res.status(403).render('errorsToken', {
            title: 'Ошбика верификации токена доступа!',
            dataError: 'Нет данных о текене!!'
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return catchError(err, res);
        }
        console.log(decoded + ' authJWT данные по декоду')
        console.log(decoded.id + ' authJWT данные по id из декода')
        req.userId = decoded.id;
        res.setHeader("x-access-token", token)
        next();
    })
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err})
            return;
        }
        Role.find({
            _id: {$in: user.role}
        }, (err, role) => {
            if(err) {
                res.status(500).send({message: err});
                return;
            }
            for(let i = 0; i < role.length; i++) {
                if(role[i].value === "ADMIN") {
                    next();
                    return;
                }
            }
            res.status(403).send({message: 'Нет роли администратора!!'});
            return;
        })
    })
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err})
            return;
        }
        Role.find({
            _id: {$in: user.role}
        }, (err, role) => {
            if(err) {
                res.status(500).send({message: err});
                return;
            }
            for(let i = 0; i < role.length; i++) {
                if(role[i].value === "MODDER") {
                    next();
                    return;
                }
            }
            res.status(403).send({message: 'Нет роли модератора!!'});
            return;
        })
    })
}

const authJWT = {
    verifytocen,
    isAdmin,
    isModerator
}

module.exports = authJWT;