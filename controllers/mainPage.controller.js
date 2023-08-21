var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model');
const Janrs = require('../models/janrs.model');

exports.mainPageData = async (req, res, next) => {
    async.parallel({
        janrs: function(callback) {
            Janrs.find({})
            .then((resJanrs) => {
                callback(null, resJanrs)
            })
            .catch((errJanrs) => {
                console.log('Возникла ошибка при поиске жанров - ', errJanrs)
                return next(errJanrs)
            })
        },
        users: function(callback) {
            Users.find({})
            .then((resUsers) => {
                callback(null, resUsers)
            })
            .catch((errUsers) => {
                console.log('При поиске пользователей возникла ошибка - ', errUsers)
            })
        },

    }, (errors, results) => {
        if(errors) {
            return next(errors)
        }
        if(results) {
            res.send(results)
        }
    })
}

exports.mainPage_createMusic_POST = async (req, res, next) => {
    res.send('Создание новогго трека')
}