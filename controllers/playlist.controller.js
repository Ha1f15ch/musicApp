var Users = require('../models/users.model');
var PlayLists = require('../models/playlist.model');
var Compositions = require('../models/compositions.model');
const async = require('async');

exports.all_playlists_GET = async (req, res, next) => {
    async.parallel({
        dataPlaylists: function(callback) {
            PlayLists.find()
            .populate({
                path: "userId",
                model: Users
            })
            .populate({
                path: "compositions",
                model: Compositions
            })
            .then((resFinded) => {
                callback(null, resFinded)
            })
            .catch((errFinded) => {
                callback(null, errFinded)
            })
        }
    }, (err, results) => {
        if(err) {
            console.log('Ошибка при поиска плэйлистов - ', err)
            return next(err)
        } else {
            res.render('admin_listPlaylists', {
                title: 'Списо плэйлистов пользователей',
                dataPlaylists: results
            })
        }
    })
}

exports.detail_playlist_GET = async (req, res, next) => {
    res.send('custom playlist by useriD')
}

exports.all_users_playlists_GET = async (req, res, next) => {
    res.send('users playLists')
}

exports.detail_users_playlist_GET = async (req, res, next) => {
    res.send('detail info about users playlist')
}
