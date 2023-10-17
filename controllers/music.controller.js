var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model');
const Janrs = require('../models/janrs.model');
const Compositions = require('../models/compositions.model');
const Playlists = require('../models/playlist.model');
const { compare } = require('bcryptjs');

exports.mainPage_listMusic_GET = async (req, res, next) => {
    async.parallel({
        dataMusic: function(calllback) {
            Compositions.find({})
            .then((resDataMusic) => {
                console.log('Получаем при поиске такие данные - ', resDataMusic)
                calllback(null, resDataMusic)
            })
            .catch((errDataMusic) => {
                console.log('Возникла ошибка при поиске - errDataMusic', errDataMusic)
                calllback(null, errDataMusic)
            })
        },
        dataJanr: function(callback) {
            Janrs.find({})
            .then((resDataJanr) => {
                callback(null, resDataJanr)
            })
            .catch((errDataJanr) => {
                console.log('Возникла ошибка при поиске - errDataJanr', errDataJanr)
                callback(null, errDataJanr)
            })
        },
        dataUser: function(callback) {
            Users.find({})
            .then((resDataUser) => {
                callback(null, resDataUser)
            })
            .catch((errDataUser) => {
                console.log('Возникла ошибка при поиске - errDataUser', errDataUser)
                callback(null, errDataUser)
            })
        },
        dataPlaylist: function(callback) {
            Playlists.find({userId: req.userIds})
            .then((resDataPlaylist) => {
                callback(null, resDataPlaylist)
            })
            .catch((errDataPlaylist) => {
                console.log('Возникла ошибка при поиске - errDataPlaylist', errDataPlaylist)
                callback(null, errDataPlaylist)
            })
        },
    }, (errors, results) => {
        if(errors) {
            console.log(errors, ' - Ошибка')
            return next(errors)
        }
        if(results) {

            //
            res.render('listMusic', {
                dataMusic: results.dataMusic,
                dataJanr: results.dataJanr,
                dataUser: results.dataUser,
                dataPlaylist: results.dataPlaylist
            })
        }
    })
}

exports.mainPage_createMusic_POST = async (req, res, next) => {

    console.log(req.body, 'BODY')
    console.log(req.userIds, ' - Хедер, запись о id пользователя')
    console.log(req.files, 'FILES')
    console.log(req.files.Composition, 'req.files.Composition')

    if(!(req.body.janrs instanceof Array)) {
        if(typeof req.body.janrs === 'undefined') {
            req.body.janrs = []
        } else {
            req.body.janrs = new Array(req.body.janrs)
            console.log(req.body.janrs, 'Список жанров')
        }
    }

    const musRoutName = req.files.Composition.name.replace(/\s/gi, '_')

    var newComposition = new Compositions({
        name: req.body.name,
        rout: '/music/' + musRoutName,
        janrs: req.body.janrs,
        description: req.body.description,
        userIdCreated: req.userIds
    });

    console.log(newComposition, ' - созданный набор данных из запроса')

    async.parallel({
        dataJanr: function(callback) {
            Janrs.find({})
            .then((resDataJanr) => {
                callback(null, resDataJanr)
            })
            .catch((errDataJanr) => {
                console.log('Возникла ошибка при поиске - errDataJanr', errDataJanr)
                callback(null, errDataJanr)
            })
        }
    }, (errs, result) => {
        if(errs) {
            console.log('При поиске возникли ошибки - ', errs)
            return next(err)
        }

        for(const janrVal of result.dataJanr) {
            if(newComposition.janrs.includes(janrVal._id)) {
                janrVal.checked = "true";
            }
        }
    })

    newComposition.save()
    .then((resNewComosition) => {
        console.log('Успешно сохранено - ', resNewComosition)
        req.files.Composition.mv('public/music/' + musRoutName, (err) => {
            if(err) {
                console.log('Ошибка при загрузке файла - ', err)
                console.log('Удаляем созданные данные из БД ...')
                Compositions.findOneAndDelete({
                    name: newComposition.name
                })
                .then((resDelete) => {
                    console.log('Выполнено успешно - ', resDelete)
                })
                .catch((errDelete) => {
                    console.log('При удалении возникла ошибка - ', errDelete)
                    return next(errDelete)
                })
                return next(err)
            } else {
                console.log(`Выполнено преобразование загруженного файла - из ${req.files.Composition.name} в ${musRoutName}`)
            }
        })
        res.redirect(newComposition.getMusic)
    })
    .catch((errNewComposition) => {
        console.log('Что-то позшло не так при сохранении - ', errNewComposition)
        console.log('Удаляем созданные данные из БД ...')
        Compositions.findOneAndDelete({
            name: newComposition.name
        })
        .then((resDelete) => {
            console.log('Выполнено успешно - ', resDelete)
        })
        .catch((errDelete) => {
            console.log('При удалении возникла ошибка - ', errDelete)
            return next(errDelete)
        })
        return next(errNewComposition)
    })
}

exports.mainPage_musicDetail_GET = (req, res, next) => {

    async.parallel({
        compositionDetaled: function(callback) {
            Compositions.findById(req.params.id)
            .populate({
                path: "userIdCreated janrs",
            })
            .then((resMusic) => {
                console.log('Поиск и данные - ', resMusic)
                callback(null, resMusic)
            })
            .catch((errMus) => {
                callback(null, errMus)
            })
        },
        janrs: function(callback) {
            Janrs.find({})
            .then((resFinded) => {
                callback(null, resFinded)
            })
            .catch((errFinded) => {
                callback(null, errFinded)
            })
        }
    }, (errors, results) => {
        if(errors) {
            console.log('Ошибки при выполнении поиска - ', errors)
            return next(errors)
        }
        for(const janr_item of results.janrs) {
            if(results.compositionDetaled.janrs.includes(janr_item._id)) {
                janr_item.checked = "true";
            }
        }
        console.log('результат сбора данных по композиции - ', results.compositionDetaled)
        console.log(results.compositionDetaled.janrs, ' - Жанры')
        res.render('detailMusic', {
            title: 'Композиция: ',
            resData: results.compositionDetaled
        })
    })
}

exports.mainPage_addComposition_inPlaylist_POST = async (req, res, next) => {
   var playlist = req.params.playlistId,
       musicItem = req.params.musicID

    try {

        var dataPlaylist = await Playlists.findById(playlist)
        var dataComposition = await Compositions.findById(musicItem)

        if(dataPlaylist.length == 0) {
            console.log('Не нашли плэйлист - ', dataPlaylist)
            res.sendStatus(404)
        }

        if(dataComposition.length == 0) {
            console.log('Трек не нашли, bedReqwest - ', dataComposition)
            res.sendStatus(404)
        }

        dataPlaylist.compositions.push(dataComposition._id+'')

        var updateData = new Playlists({
            name: dataPlaylist.name,
            compositions: dataPlaylist.compositions,
            userId: dataPlaylist.userId,
            _id: dataPlaylist._id
        })

        await Playlists.findByIdAndUpdate(dataPlaylist._id, updateData, {})
        .then((resUpdated) => {
            console.log('Успешно обновлено - ', resUpdated)
            res.sendStatus(200)
        })        
        .catch((errUpdated) => {
            console.log('Ошибка обновления - ', errUpdated)
            res.sendStatus(505)
        })
    } catch(e) {
        console.log('Ошибка при выполнении роута update плэйлиста - ', e)
        return next(e)
    }
}

exports.mainPage_delete_music_fromPlaylist_PUT = async (req, res, next) => {
    var id_playlist = req.params.playlistId
    console.log('Данные, которые получаем - ', req.body.positionValue)
    res.sendStatus(200)
}