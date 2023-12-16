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

exports.adminPage_listMusic_GET = async (req, res, next) => {
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
            res.render('admin_listMus', {
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
        req.files.Composition.mv('/root/serverDir/musicApp/public/music/' + musRoutName, (err) => {
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

exports.adminPage_createMusic_POST = async (req, res, next) => {

    if(!(req.body.janrs instanceof Array)) {
        if(typeof req.body.janrs === 'undefined') {
            req.body.janrs = []
        } else {
            req.body.janrs = new Array(req.body.janrs)
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
        req.files.Composition.mv('/root/serverDir/musicApp/public/music/' + musRoutName, (err) => {
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
        res.redirect(newComposition.getMusicByAdmin)
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
        res.render('detailMusic', {
            title: 'Композиция: ',
            resData: results.compositionDetaled
        })
    })
}

exports.mainPage_MyMusicDetail_GET = (req, res, next) => {

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
                janr_item.checked = true;
            }
        }
        res.render('MyMusicDetail', {
            title: 'Композиция: ',
            resData: results.compositionDetaled,
            janrData: results.janrs
        })
    })
}

exports.mainPage_MyMusic_UPDATE = async (req, res, next) => {
    var user_id = req.userIds
    var new_data_nameMusic = req.body.name
    var new_data_janrsMusic = req.body.array_janrs
    var new_data_descriptionMusic = req.body.description

    console.log(new_data_nameMusic, new_data_janrsMusic, new_data_descriptionMusic, ' - data from client')

    var finded_music = await Compositions.findById(req.params.id)
    var finded_music_fromReq = await Compositions.find({
        "name": new_data_nameMusic
    })

    if((Object.keys(finded_music_fromReq).length === 0) || ((Object.keys(finded_music_fromReq).length === 1) && (req.params.id+'' == finded_music._id+''))) {
        console.log('Такого названия композиции в системе нет, записываем . . .')
        var new_misuc_value = new Compositions({
            name: new_data_nameMusic,
            rout: finded_music.rout,
            janrs: new_data_janrsMusic,
            description: new_data_descriptionMusic,
            userIdCreated: finded_music.userIdCreated,
            _id: req.params.id
        })

        await Compositions.findByIdAndUpdate(req.params.id, new_misuc_value, {})
        .then((resUpdate) => {
            console.log('Успешно обновлено - ', resUpdate)
            res.sendStatus(200)
        })
        .catch((errUpdate) => {
            console.log('ошибка при апдейте - ', errUpdate)
            res.sendStatus(505)
        })
    } else {
        console.log('Название композиции есть у другой композиции, которую сейчас не редактируют, отсылаем 404 . . .')
        res.sendStatus(404)
    }
}

exports.adminPage_musicDetail_GET = async (req, res, next) => {

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
        res.render('adminPage_detailMusic', {
            title: 'Композиция: ',
            resData: results.compositionDetaled,
            janrData: results.janrs
        })
    })
}

exports.adminPage_Music_UPDATE = async (req, res, next) => {
    var new_data_nameMusic = req.body.name
    var new_data_janrsMusic = req.body.array_janrs
    var new_data_descriptionMusic = req.body.description

    console.log(new_data_nameMusic, new_data_janrsMusic, new_data_descriptionMusic, ' - data from client')

    var finded_music = await Compositions.findById(req.params.id)
    var finded_music_fromReq = await Compositions.find({
        "name": new_data_nameMusic
    })

    if((Object.keys(finded_music_fromReq).length === 0) || ((Object.keys(finded_music_fromReq).length === 1) && (req.params.id+'' == finded_music._id+''))) {
        console.log('Такого названия композиции в системе нет, записываем . . .')
        var new_misuc_value = new Compositions({
            name: new_data_nameMusic,
            rout: finded_music.rout,
            janrs: new_data_janrsMusic,
            description: new_data_descriptionMusic,
            userIdCreated: finded_music.userIdCreated,
            _id: req.params.id
        })

        await Compositions.findByIdAndUpdate(req.params.id, new_misuc_value, {})
        .then((resUpdate) => {
            console.log('Успешно обновлено - ', resUpdate)
            res.sendStatus(200)
        })
        .catch((errUpdate) => {
            console.log('ошибка при апдейте - ', errUpdate)
            res.sendStatus(505)
        })
    } else {
        console.log('Название композиции есть у другой композиции, которую сейчас не редактируют, отсылаем 404 . . .')
        res.sendStatus(404)
    }
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

exports.adminPage_addComposition_inPlaylist_POST = async (req, res, next) => {
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
    var index_Composition = req.body.positionValue
    var dataPlaylist = await Playlists.findById(id_playlist)
    console.log('Весь список композиций - ', dataPlaylist.compositions)
    console.log('Индекс удаляемого элемента - ', index_Composition)
    try {

        var newMAss = dataPlaylist.compositions.splice(index_Composition, 1)
        console.log('После удаления композиции - ', dataPlaylist.compositions)

        var newPlaylistData = new Playlists({
            name: dataPlaylist.name,
            compositions: dataPlaylist.compositions,
            userId: dataPlaylist.userId,
            _id: dataPlaylist._id
        })

        await Playlists.findByIdAndUpdate(dataPlaylist._id, newPlaylistData, {})
        .then((resUpdated) => {
            console.log('Успешно обновлено - ', resUpdated)
            res.sendStatus(200)
        })
        .catch((errUpdated) => {
            console.log('Ошибка при удалении композиции из плэйлиста - ', errUpdated)
            return next(errUpdated)
        })
    } catch(e) {
        console.log('Возникла ошибка при удалении композиции из плэйлиста - ', e)
        res.sendStatus(505)
    }
}

exports.adminPAge_delete_music_fromPlaylist_PUT = async (req, res, next) => {
    var id_playlist = req.params.playlistId
    var index_Composition = req.body.positionValue
    var dataPlaylist = await Playlists.findById(id_playlist)
    console.log('Весь список композиций - ', dataPlaylist.compositions)
    console.log('Индекс удаляемого элемента - ', index_Composition)
    try {

        var newMAss = dataPlaylist.compositions.splice(index_Composition, 1)
        console.log('После удаления композиции - ', dataPlaylist.compositions)

        var newPlaylistData = new Playlists({
            name: dataPlaylist.name,
            compositions: dataPlaylist.compositions,
            userId: dataPlaylist.userId,
            _id: dataPlaylist._id
        })

        await Playlists.findByIdAndUpdate(dataPlaylist._id, newPlaylistData, {})
        .then((resUpdated) => {
            console.log('Успешно обновлено - ', resUpdated)
            res.sendStatus(200)
        })
        .catch((errUpdated) => {
            console.log('Ошибка при удалении композиции из плэйлиста - ', errUpdated)
            return next(errUpdated)
        })
    } catch(e) {
        console.log('Возникла ошибка при удалении композиции из плэйлиста - ', e)
        res.sendStatus(505)
    }
}

exports.adminPAge_delete_music_fromPlaylist_byUserId_PUT = async (req, res, next) => {
    var id_playlist = req.params.idP
    var index_Composition = req.body.positionValue
    var dataPlaylist = await Playlists.findById(id_playlist)
    console.log('Весь список композиций - ', dataPlaylist.compositions)
    console.log('Индекс удаляемого элемента - ', index_Composition)
    try {

        var newMAss = dataPlaylist.compositions.splice(index_Composition, 1)
        console.log('После удаления композиции - ', dataPlaylist.compositions)

        var newPlaylistData = new Playlists({
            name: dataPlaylist.name,
            compositions: dataPlaylist.compositions,
            userId: dataPlaylist.userId,
            _id: dataPlaylist._id
        })

        await Playlists.findByIdAndUpdate(dataPlaylist._id, newPlaylistData, {})
        .then((resUpdated) => {
            console.log('Успешно обновлено - ', resUpdated)
            res.sendStatus(200)
        })
        .catch((errUpdated) => {
            console.log('Ошибка при удалении композиции из плэйлиста - ', errUpdated)
            return next(errUpdated)
        })
    } catch(e) {
        console.log('Возникла ошибка при удалении композиции из плэйлиста - ', e)
        res.sendStatus(505)
    }
}

exports.mainPage_myMusic_GET = async (req, res, next) => {
    var userID = req.userIds

    var dataMus = await Compositions.find({
        userIdCreated: userID
    })
    .populate({
        path: "janrs",
        model: Janrs
    })
    .populate({
        path: "userIdCreated",
        model: Users
    })

    var dataJanrs = await Janrs.find({})

    res.render('main_myMusic', {
        title: "Мои композиции",
        data_mus: dataMus,
        data_janr: dataJanrs
    })
}

exports.mainPage_deleteMyMusic_DELETE = async (req, res, next) => {
    var id_deleted_music = req.params.id

    var deleted_music = await Compositions.findById(id_deleted_music)
    
    if(deleted_music) {
        await Compositions.findByIdAndRemove(id_deleted_music)
        .then((resDeleted) => {
            console.log('Удаление прошло успешно - ', resDeleted)
            res.sendStatus(200)
        })
        .catch((errDeleted) => {
            console.log('Удаление не выполнено ! Ошибка - ', errDeleted)
            res.sendStatus(500)
        })
    } else {
        console.log('Данные не найдены !!')
        return next()
    }
}

exports.adminPage_myCompositions_GET = async (req, res, next) => {
    var userID = req.userIds

    var dataMus = await Compositions.find({
        userIdCreated: userID
    })
    .populate({
        path: "janrs",
        model: Janrs
    })
    .populate({
        path: "userIdCreated",
        model: Users
    })

    var dataJanrs = await Janrs.find({})

    res.render('adminPage_myCompositions', {
        title: "Мои композиции",
        data_mus: dataMus,
        data_janr: dataJanrs
    })
}

exports.adminPage_MyMusicDetail_GET = (req, res, next) => {

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
                janr_item.checked = true;
            }
        }
        res.render('adminPage_MyMusicDetail', {
            title: 'Композиция: ',
            resData: results.compositionDetaled,
            janrData: results.janrs
        })
    })
}

exports.adminPage_MyMusic_UPDATE = async (req, res, next) => {
    var user_id = req.userIds
    var new_data_nameMusic = req.body.name
    var new_data_janrsMusic = req.body.array_janrs
    var new_data_descriptionMusic = req.body.description

    console.log(new_data_nameMusic, new_data_janrsMusic, new_data_descriptionMusic, ' - data from client')

    var finded_music = await Compositions.findById(req.params.id)
    var finded_music_fromReq = await Compositions.find({
        "name": new_data_nameMusic
    })

    if((Object.keys(finded_music_fromReq).length === 0) || ((Object.keys(finded_music_fromReq).length === 1) && (req.params.id+'' == finded_music._id+''))) {
        console.log('Такого названия композиции в системе нет, записываем . . .')
        var new_misuc_value = new Compositions({
            name: new_data_nameMusic,
            rout: finded_music.rout,
            janrs: new_data_janrsMusic,
            description: new_data_descriptionMusic,
            userIdCreated: finded_music.userIdCreated,
            _id: req.params.id
        })

        await Compositions.findByIdAndUpdate(req.params.id, new_misuc_value, {})
        .then((resUpdate) => {
            console.log('Успешно обновлено - ', resUpdate)
            res.sendStatus(200)
        })
        .catch((errUpdate) => {
            console.log('ошибка при апдейте - ', errUpdate)
            res.sendStatus(505)
        })
    } else {
        console.log('Название композиции есть у другой композиции, которую сейчас не редактируют, отсылаем 404 . . .')
        res.sendStatus(404)
    }
}

exports.adminPage_deleteMyMusic_DELETE = async (req, res, next) => {
    var id_deleted_music = req.params.id

    var deleted_music = await Compositions.findById(id_deleted_music)
    
    if(deleted_music) {
        await Compositions.findByIdAndRemove(id_deleted_music)
        .then((resDeleted) => {
            console.log('Удаление прошло успешно - ', resDeleted)
            res.sendStatus(200)
        })
        .catch((errDeleted) => {
            console.log('Удаление не выполнено ! Ошибка - ', errDeleted)
            res.sendStatus(500)
        })
    } else {
        console.log('Данные не найдены !!')
        return next()
    }
}

exports.mainPage_setMusicScore_UPDATE = async (req, res, next) => {
    console.lof(req.params.id, ' - id пользователя')
    console.log(req.userIds, ' - id авторизованного пользователя')

    var pakScore = req.body.UsersScore
    console.log('Что получаем от клиента - ', pakScore)

    async.parallel({
        infoMusic: function(callback) {
            Compositions.findById(req.params.id)
            .then((resFinded) => {
                callback(null, resFinded)
            })
            .catch((errFinded) => {
                callback(null, errFinded)
            })
        },
    }, async (err, results) => {
        if(err) {
            console.log('Возникла ошибка при поиске композиции', err)
            return nextTick(err)
        }

        var editedMusic = new Compositions({
            name: results.infoMusic.name,
            rout: results.infoMusic.rout,
            janrs: results.infoMusic.janrs,
            description: results.infoMusic.description,
            AVGScore: results.infoMusic.AVGScore.push(pakScore),
            userIdCreated: results.infoMusic.userIdCreated,
            _id: req.params.id
        })

        await Compositions.findByIdAndUpdate(req.params.id, editedMusic, {})
        .then((resUpdate) => {
            console.log('Успешно обновлено - ', resUpdate)
        })
        .catch((errUpdate) => {
            console.log('Ошибка при обновлении - ', errUpdate)
            return next(errUpdate)
        })
    })
}