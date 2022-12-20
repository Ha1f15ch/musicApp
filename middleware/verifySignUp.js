const User = require('../models/user.model')
const Role = require('../models/role.model')

checkDuplicateUserNameOrEmail = (req, res, next) => {
    //Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }
        if(user) {
            res.status(500).send({message: 'Данный Username уже есть, попробуйте другой'});
            return;
        }
        //Email
        User.findOne({
            email: req.body.email
        }).exec((err, email) => {
            if(err) {
                res.status(500).send({message: err})
                return;
            }
            if(email) {
                res.status(500).send({message: 'Такой email уже используется!!'})
                return;
            }
            next();
        })
    })
}

checkRoleExisted = (req, res, next) => {
    if(req.body.roles) {
        for(let i = 0; i < req.body.roles.length; i++) {
            if(!Role.includes(req.body.roles[i])) {
                res.status(500).send({message: `Такой роли нет в БД!! - ${req.body.roles[i]}`});
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUserNameOrEmail,
    checkRoleExisted
};

module.exports = verifySignUp;