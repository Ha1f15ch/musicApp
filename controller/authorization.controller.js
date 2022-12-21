const config = require('./config')
const User = require('../models/user.model')
const Role = require('../models/role.model')

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

//registration 
exports.sigup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        pass: bcrypt.hashSync(req.body.pass, 8)
    });

    user.save((err, user) => {
        if(err) {
            res.status(500).send({message: err})
            return;
        }
        if(req.body.roles) {
            Role.find({
                value: {$in: req.body.roles}
            }, (err, roles) => {
                if(err) {
                    res.status(500).send({message: err})
                    return;
                }

                user.role = roles.map(role => role._id)
                user.save(err => {
                    if(err) {
                        res.status(500).send({message: err})
                        return;
                    }
                    //succesfull -------------------------------
                    res.send({message: 'Пользователь успешно зарегистрирован!!'})
                })
            })
        } else {
            Role.findOne({value: "USER"}, (err, role) => {
                if(err) {
                    res.status(500).send({message: err})
                    return
                }
                user.role = [role._id];
                user.save(err => {
                    if(err) {
                        res.status(500).send({message: err})
                        return;
                    }
                    //succesful-------------------------------------
                    res.send({message: 'Ползователь успешно зарегистрирован!!'})
                })
            })
        }
    })
};

//authorization
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
    .populate("role", "-__v")
    .exec((err, user) => {
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
            expiresIn: 86400
        });

        var authorities = [];

        for(let i = 0; i < user.role.length; i++) {
            authorities.push("ROLE_" + user.role[i].value.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    });
};