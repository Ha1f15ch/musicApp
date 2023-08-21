const Users = require('../models/users.model');
const Compositions = require('../models/compositions.model');
const Janrs = require('../models/janrs.model');
const Playlists = require('../models/playlist.model');

const async = require('async');

musicParameterValidation = (req, res, next) => {
    console.log('Удостоверяемся, что в cookie сохранен Id пользователя - ', req.userIds)

    async.parallel({
        music: function(callback) {
            Compositions.find({name: req.body.name})
            .then((resComposition) => {
                callback(null, resComposition)
            })
            .catch((errComposition) => {
                callback(null, errComposition)
            })
        }
    }, (err, results) => {
        if(err) {
            return next(err)
        }
        if(results) {
            if(results.name = req.body.name) {
                res.send('Ошибка, Вы ввели название композиции, которое уже зарегистрирован ов системе')
            } else {
                next()
            }
        }
    })
};

const musicValidation = {
    musicParameterValidation
}

module.exports = musicValidation;