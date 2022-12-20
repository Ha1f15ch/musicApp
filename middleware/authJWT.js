const jwt = require('jsonwebtoken')
const config = require('../controller/config')
const Role = require('../models/role.model')
const User = require('../models/user.model')

verifytocen = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if(!token) {
        return res.status(403).send({message: 'Нет данных о текене!!'})
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: 'Не авторизован!! Ошибка при обработке токена!'})
        }
        req.userId = decoded.id;
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