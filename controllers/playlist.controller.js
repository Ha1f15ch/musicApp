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
                title: 'Список плэйлистов пользователей',
                dataPlaylists: results
            })
        }
    })
}

exports.adminPage_detail_playlist_GET = async (req, res, next) => {
    var playlistID = req.params.id

    async.parallel({
        data_playlist: function(callback) {
            PlayLists.findById(playlistID)
            .populate({
                path: "compositions",
                model: Compositions,
                populate: {
                    path: "userIdCreated",
                    model: Users
                }
            })
            .populate({
                path: "userId",
                model: Users
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
            console.log('При обработке произошла ошибка - ', err)
            return next(err)
        }

        res.render('adminPage_detailPlaylist', {
            title: `информация о плэйлисте - ${results.data_playlist.name}`,
            data_playlist: results.data_playlist,
        })
    })
}

exports.detail_users_playlist_GET = async (req, res, next) => {
    var userID = req.params.idU
    var playlistID = req.params.idP

    async.parallel({
        data_user: function(callback) {
            Users.findById(userID)
            .then((resFinded) => {
                callback(null, resFinded)
            })
            .catch((errFinded) => {
                callback(null, errFinded)
            })
        },
        data_playlist: function(callback) {
            PlayLists.findById(playlistID)
            .populate({
                path: "compositions",
                model: Compositions,
                populate: {
                    path: "userIdCreated",
                    model: Users
                }
            })
            .populate({
                path: "userId",
                model: Users
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
            console.log('При обработке произошла ошибка - ', err)
            return next(err)
        }

        res.render('adminPage_detailPlaylist_byUser', {
            title: `информация о плэйлисте пользователя - ${results.data_user.login}`,
            data_playlist: results.data_playlist,
            data_user: results.data_user
        })
    })
}

exports.adminPage_updatePlaylist_name_PUT = async (req, res, next) => {

    try {

        var foundedPlaylists = await PlayLists.findById(req.params.id)
        var new_namePlaylist = req.body.name
        var listCorrectNamesplaylists = await PlayLists.find({
            name: new_namePlaylist
        })

        let tempMassValidIds = listCorrectNamesplaylists.map((el) => el._id+'')

        if((tempMassValidIds.includes(req.params.id) && tempMassValidIds.length == 1) || tempMassValidIds.length == 0) {
            var newPlaylist = new PlayLists({
                name: new_namePlaylist,
                compositions: foundedPlaylists.compositions,
                userId: foundedPlaylists.userId,
                _id: req.params.id
            })

            await PlayLists.findByIdAndUpdate(req.params.id, newPlaylist, {})
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

exports.adminPage_updatePlaylist_name_byUserId_PUT = async (req, res, next) => {

    try {

        var foundedPlaylists = await PlayLists.findById(req.params.idP)
        var new_namePlaylist = req.body.name
        var listCorrectNamesplaylists = await PlayLists.find({
            name: new_namePlaylist
        })

        let tempMassValidIds = listCorrectNamesplaylists.map((el) => el._id+'')

        if((tempMassValidIds.includes(req.params.id) && tempMassValidIds.length == 1) || tempMassValidIds.length == 0) {
            var newPlaylist = new PlayLists({
                name: new_namePlaylist,
                compositions: foundedPlaylists.compositions,
                userId: foundedPlaylists.userId,
                _id: req.params.idP
            })

            await PlayLists.findByIdAndUpdate(req.params.idP, newPlaylist, {})
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

exports.adminPage_deletePlaylist_DELETE = async (req, res, next) => {
    try {

        await PlayLists.findById(req.params.id)
        .then((resFinded) => {
            console.log('Найдено - ', resFinded)
            PlayLists.findByIdAndDelete(resFinded._id)
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

exports.adminPage_deletePlaylist_byUserId_DELETE = async (req, res, next) => {
    try {

        await PlayLists.findById(req.params.idP)
        .then((resFinded) => {
            console.log('Найдено - ', resFinded)
            PlayLists.findByIdAndDelete(resFinded._id)
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
