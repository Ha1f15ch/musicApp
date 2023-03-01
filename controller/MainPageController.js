var User = require('../models/user.model')
var UserProfile = require('../models/profileUser')
var Playlists = require('../models/PlaylistUsers.model')
var DataPlaylistUsers = require('../models/DataPlaylistUsers.model')
const async = require('async');
const jwt = require('jsonwebtoken');
const { secret } = require('../controller/config')
const { validationResult } = require('express-validator');

var bcrypt = require('bcryptjs')

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
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData
        console.log('IdUser - ', req.user)

        async.parallel({
            userProfile: function(callback) {
                UserProfile.findOne({id_login_guest: req.user.id})
                    .exec(callback)
            },
            user: function(callback) {
                User.findById(req.user.id)
                    .exec(callback)
            },
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
};

//Update page with profile User GET
exports.UPDATEmyProfileLoad_GET = async (req, res, next) => {
    
    let tempValTokenHeader = req.headers.cookie.split('token=')[1]
    const decodedData = jwt.verify(tempValTokenHeader, secret)
    req.user = decodedData
    var dataForFind = req.user.id
    var foundDataProfile = await UserProfile.findOne({id_login_guest: dataForFind});
    //var IdProfileUser = foundDataProfile._id

    async.parallel({
        USER: function(callback) {
            User.findById(dataForFind).exec(callback)
        }
    }, (err, results) => {
        if(err) {
            return next(err)
        }
        res.render('UpdateProfile', {
            title: 'Изменение данных профиля',
            userProfile: foundDataProfile,
            user: results.USER
        })
    })
}

//Update page with profile User POST
exports.UPDATEmyProfileLoad_POST = [
    
   async (req, res, next) => {
        const errors = validationResult(req)

        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData
        var dataForFind = req.user.id
        var foundDataProfile = await UserProfile.findOne({id_login_guest: dataForFind});
        var IdProfileUser = foundDataProfile._id

        var USER = new User({
            username: req.body.username,
            email: req.body.email,
            _id: dataForFind
        })

        var PROFILE = new UserProfile({
            FirstName: typeof req.body.FirstName === "undefined" ? ' ' : req.body.FirstName,
            MidName: typeof req.body.MidName === "undefined" ? ' ' : req.body.MidName,
            LastName: typeof req.body.LastName === "undefined" ? ' ' : req.body.LastName,
            AboutUser: typeof req.body.AboutUser === "undefined" ? ' ' : req.body.AboutUser,
            _id: IdProfileUser
        })

        if(!errors.isEmpty()) {
            res.render('UpdateProfile', {
                title: 'Изменение данных профиля',
                userProfile: PROFILE,
                user: USER,
                errors: errors.array()
            });
        } else {
            User.findByIdAndUpdate(dataForFind, USER, {}, function(err) {
                if(err) {
                    return next(err);
                }
                console.log('140_USER UPDATED')
            })
            UserProfile.findByIdAndUpdate(IdProfileUser, PROFILE, {}, function(err) {
                if(err) {
                    return next(err);
                }
                console.log('146_USER_PROFILE_UPDATED')
            })
            res.redirect('/myprofile')
        }
    }
]