var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model');
const Janrs = require('../models/janrs.model');
const PlaylistModel = require('../models/playlist.model');
const Compositions = require('../models/compositions.model');

exports.mainPage_GET = async (req, res, next) => {
    res.render('adminPage', {
        title: 'Главная страница администрации'
    })
}

exports.MyProfile_GET = async (req, res, next) => {
    try {
        
        async.parallel({
            userData: function(callback) {
                Users.findById(req.userIds)
                .populate({
                    path: "role",
                    model: Roles
                })
                .then((resUsersData) => {
                    callback(null, resUsersData)
                })
                .catch((erruserData) => {
                    return next(erruserData)
                })
            },
            userPlalistData: function(callback) {
                PlaylistModel.find({
                    userId: req.userIds
                })
                .populate({
                    path: 'userId', 
                    model: Users
                })
                .populate({
                    path: 'compositions',
                    model: Compositions
                })
                .then((resPLaylists) => {
                    console.log('Было найдено - ', resPLaylists)
                    callback(null, resPLaylists)
                })
                .catch((errPlaylists) => {
                    console.log('Небыло найдлено - ', errPlaylists)
                    callback(null, errPlaylists)
                })
            },  
            userProfileData: function(callback) {
                UserProfile.find({idUser: req.userIds})
                .then((resUserProfileData) => {
                    callback(null, resUserProfileData)
                })
                .catch((errUserProfileData) => {
                    return next(errUserProfileData)
                })
            }
        }, (errors, result) => {
            if(errors) {
                console.log(errors, 'Еррорсы')
                return next(errors)
            }
            console.log(result, 'Данные пользователя')
            res.render('main_myProfile', {
                title: "Мой профиль",
                userData: result.userData,
                userPlaylistData: result.userPlalistData,
                userProfileData: result.userProfileData
            })
        })

    } catch(e) {
        console.log('Возникла ошибка во время работы роута - ', e)
    }
}

exports.MyProfile_PUT = async (req, res, next) => {

    var token = req.headers.cookie.split('access_token=')[1]
    var valToken = token.split('.')[1]
    var parsToken = valToken.replace(/-/g, '+').replace(/_/g, '/');
    var decodedToken = JSON.parse(Buffer.from(parsToken, 'base64').toString('binary'));

    console.log(decodedToken, ' - Декодед')

    await UserProfile.findOne({idUser: decodedToken.id})
    .then(async (resProfileUserId) => {
        console.log('Найдено значение - ', resProfileUserId)

        var newUserProfileData = new UserProfile({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            midlName: req.body.midlName,
            ageUser: req.body.ageUser,
            aboutUser: req.body.aboutUser,
            _id: resProfileUserId._id
        })
    
        await UserProfile.findByIdAndUpdate(resProfileUserId._id, newUserProfileData, {})
        .then((resUpdate) => {
            console.log(resUpdate, ' - Результат апдейта')
            res.redirect('/v1/api/myProfile')
        })
        .catch((errUpdate) => {
            console.log('Ошибка при выполнении апдейта - ', errUpdate)
            return next(errUpdate)
        })
    })
    .catch((errProfileUserId) => {
        console.log('Возникла ошибка при поиске - ', errProfileUserId)
        return next(errProfileUserId)
    })

}

exports.createPlaylist_POST = async (req, res, next) => {
    var userId = req.userIds

    try {

        var foundedPlaylists = await PlaylistModel.find({
            name: req.body.name
        })
        
        var tempFoundedPlaylists = foundedPlaylists.map((el) => el.name+'')
        if(tempFoundedPlaylists.includes(req.body.name)) {
            res.sendStatus(404)
        } else {
            var newPlaylist = new PlaylistModel({
                name: req.body.name,
                //composition: - возможно, добавление в UI каких-то просматриваемые композиции, через список checkBox
                userId: userId
            })

            newPlaylist.save()
            .then((resSave) => {
                console.log('Успешно создан новый плэйлист - ', resSave.name)
                res.sendStatus(200)
            })
            .catch((errSave) => {
                console.log('При создании - ', req.body.name, ' возникла ошибка - ', errSave)
                res.sendStatus(505)
            })
        }
    } catch(e) {
        console.log('Возникла ошибка при попытке выполнить создание плэйлиста', e)
    }
}

exports.list_myPlaylists_GET = async (req, res, next) => {
    try {

        async.parallel({
            playlists: function(callback) {
                PlaylistModel.find({
                    userId: req.userIds
                })
                .populate({
                    path: 'userId', 
                    model: Users
                })
                .populate({
                    path: 'compositions',
                    model: Compositions
                })
                .then((resPLaylists) => {
                    console.log('Было найдено - ', resPLaylists)
                    callback(null, resPLaylists)
                })
                .catch((errPlaylists) => {
                    console.log('Небло найдлено - ', errPlaylists)
                    callback(null, errPlaylists)
                })
            }
        }, (err, result) => {
            if(err) {
                console.log('Возникла ошибка при общем происке - ', err)
                return next(err)
            }
            res.render('main_myPlaylists', {
                title: 'Мои плэйлисты',
                dataResult: result.playlists
            })
        })

    } catch(e) {
        console.log('Возникла ошибка - ', e)
    }
}

exports.myPlaylistDetail_GET = async (req, res, next) => {
    
    try {
        await PlaylistModel.findById(req.params.id)
        .populate({
            path: 'userId', 
            model: Users
        })
        .populate({
            path: 'compositions',
            model: Compositions
        })
        .then((resPLaylists) => {
            console.log('Было найдено - ', resPLaylists)
            res.render('main_myPlaylistDetail', {
                title: 'Подробнее о плэйлисте',
                dataResult: resPLaylists
            })
        })
        .catch((errPlaylists) => {
            console.log('Не было найдено - ', errPlaylists)
            return next(errPlaylists)
        })
    } catch(e) {
        console.log('при загрузке подробностей о плэйлисте возникла ошибка - ', e)
    }
}

exports.updatePlaylist_name_PUT = async (req, res, next) => {

    try {

        var foundedPlaylists = await PlaylistModel.findById(req.params.id)
        var new_namePlaylist = req.body.name
        var listCorrectNamesplaylists = await PlaylistModel.find({
            name: new_namePlaylist
        })

        let tempMassValidIds = listCorrectNamesplaylists.map((el) => el._id+'')

        if((tempMassValidIds.includes(req.params.id) && tempMassValidIds.length == 1) || tempMassValidIds.length == 0) {
            var newPlaylist = new PlaylistModel({
                name: new_namePlaylist,
                compositions: foundedPlaylists.compositions,
                userId: foundedPlaylists.userId,
                _id: req.params.id
            })

            await PlaylistModel.findByIdAndUpdate(req.params.id, newPlaylist, {})
            .then((resUpdate) => {
                console.log('Успешно обновлено - ', resUpdate)
                res.sendStatus(200)
            })
            .catch((errUpdate) => {
                console.log('Ошибка при апдейте - ', errUpdate)
                res.sendStatus(500)
            })
        } else {
            console.log('Возникло совпадение с названием плэйлиста у другого пользователя')
            res.sendStatus(404)
        }
    } catch(e) {
        console.log('Ошибка в работе апдейта - ', e)
        return next(e)
    }
}

exports.deletePlaylist_DELETE = async (req, res, next) => {
    try {

        await PlaylistModel.findById(req.params.id)
        .then((resFinded) => {
            console.log('Найдено - ', resFinded)
            PlaylistModel.findByIdAndDelete(resFinded._id)
            .then((resDelete) => {
                console.log('Успешно удалено', resDelete)
                res.sendStatus(200)
            })
            .catch((errDelete) => {
                console.log('Ошибка при удалении - ', errDelete)
                res.sendStatus(505)
            })
        })
        .catch((errFind) => {
            console.log('Ошибка при поиске - ', errFind)
            res.sendStatus(504)
        })
    } catch(e) {
        console.log('Ошибка при удалении - ', e)
        return next(e)
    }
}

