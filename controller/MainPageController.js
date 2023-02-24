var User = require('../models/user.model')
var UserProfile = require('../models/profileUser')
var Playlists = require('../models/PlaylistUsers.model')
var DataPlaylistUsers = require('../models/DataPlaylistUsers.model')
const async = require('async');
const jwt = require('jsonwebtoken');
const { secret } = require('../controller/config')

exports.showAll = function(req, res, next) {

    User.find({})
    .exec(function(err, User_data) {
        console.log(User_data)
        if(err) {return next(err)}
        res.render('MainPage', {title: 'Главная страница', Udata: User_data})
    });
};

exports.myProfileLoad_GET = function(req, res, next) { //res.render('profileHalf', {title: 'Мой профиль'})
    try {
        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        console.log('MainPageController.js__22 - ', tempValTokenHeader)
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData
        console.log('IdUser - ', req.user)
        async.parallel({
            userProfile: function(callback) {
                UserProfile.findById(req.user.id)
                    .exec(callback)
            },
            user: function(callback) {
                User.findById(req.user.id)
                    .exec(callback)
            },
            /* playlists: function(callback) {
                Playlists.find({'UserID_has_Playlist': req.user.id})
                    .exec(callback)
            },
            dataPlaylistUser: function(callback) {
                DataPlaylistUsers.find({})
                    .populate('Playlists', 'TrackList')
                    .exec(callback)
            } */
            /* user from id, from token
             by idUser found userProfile
             by UserId found Playlist (name and other)
             by Id User and Id Playlist found track in playlists
             by IdUser found track List for USerProfile */
        }, function(err, results) {
            if(err) {
                return next(err);
            }
            // if(results.userProfile == undefined || results.user == undefined || results.playlists == undefined || results.dataPlaylistUser == undefined) {
            //     const err = new Error('Одного или нескольких частей данных не хватает для корректной загрузки страницы!! _54')
            //     err.status = 404;
            //     return next(err)
            // }
            res.render('profileHalf', {
                title: 'Мой профиль',
                userProfile: results.userProfile,
                user: results.user
            })
        })
    } catch(e) {
        console.log(e)
    }
}