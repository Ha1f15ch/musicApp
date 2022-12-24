const config = require('./config')
const db = require('../models')
const { user: User, role: Role, refreshToken: RefreshToken } = db;

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
exports.signin_GET = (req, res, next) => {
    res.render('authorization', {
        title: 'Вход'
    })
}

// POST
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

        let refreshToken = await RefreshToken.createToken(user);

        var authorities = [];

        for(let i = 0; i < user.role.length; i++) {
            authorities.push("ROLE_" + user.role[i].value.toUpperCase());
        }
        /* res.status(200) */
        res.setHeader("x-access-token", token)
        
        .send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
        });
    });
};

exports.refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;

    if(requestToken == null) {
        return res.status(403).render('errorsToken', {
            title: 'Ошбика верификации токена доступа!',
            dataError: 'Токен доступа отсутствует, проверьте настройки куки, авторизуйтесь повторно на сайте'
        });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        if(!refreshToken) {
            res.status(403).json({message: 'Такого токена нет в БД!!'});
            return;
        }

        if(RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify: false}).exec();

            res.status(403).json({message: 'Токен обновления устарел, перезайдите в уч запись'});
            return;
        }

        let newAccessToken = jwt.sign({id: refreshToken.user._id}, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({message: err});
    }
};