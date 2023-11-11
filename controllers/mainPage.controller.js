var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model');
const Janrs = require('../models/janrs.model');
const PlaylistModel = require('../models/playlist.model');
const Compositions = require('../models/compositions.model');

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
            res.render('main', {
                title: "Главная страница", 
                dataJanrs: results.janrs,
                dataUsers: results.users
            })
        }
    })
}

exports.mainPage_GeneralSearch_value_fromReq_GET = async (req, res, next) => {
    var user_data = req.params.value 
    console.log(user_data, ' - user_data')
    var errMSSG = 'В системе по данному запросу ничего не найдено, попробуйте задать вопрос иначе'

    async.parallel({
        composition_data: function(callback) {
            Compositions.find({
                name: {
                    $regex: `.*${user_data}.*`, $options: 'si'
                }
            })
            .then((resCompositionData) => {
                callback(null, resCompositionData)
            })
            .catch((errCompositionData) => {
                callback(null, errCompositionData)
            })
        },
        users_data: function(callback) {
            Users.find({
                login: {
                    $regex: `.*${user_data}.*`, $options: 'si'
                }
            })
            .limit(5)
            .then((resUsers_data) => {
                callback(null, resUsers_data)
            })
            .catch((errUseres_data) => {
                callback(null, errUseres_data)
            })
        },
        janr_data: function(callback) {
            Janrs.find({
                name: {
                    $regex: `.*${user_data}.*`, $options: 'si'
                }
            })
            .limit(5)
            .then((resJanrs_data) => {
                callback(null, resJanrs_data)
            })
            .catch((errJanrs_data) => {
                callback(null, errJanrs_data)
            })
        }
    }, async (err, results) => {

        if(err) {
            console.log('Созникла ошибка при поиске в разделах - ', err)
            return next(err)
        }

        res.render('main_searchList', {
            title: `Поиск по значению - "${user_data}"`,
            show_composition: results.composition_data,
            show_janrs: results.janr_data,
            show_users: results.users_data,
            errMSSG: errMSSG
        })
    }) 
}

exports.mainPage_fastSearch_value_fromReq = async (req, res, next) => {

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

    await UserProfile.findOne({idUser: req.userIds})
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
            res.sendStatus(200)
        })
        .catch((errUpdate) => {
            console.log('Ошибка при выполнении апдейта - ', errUpdate)
            res.sendStatus(500)
        })
    })
    .catch((errProfileUserId) => {
        console.log('Возникла ошибка при поиске - ', errProfileUserId)
        res.sendStatus(404)
    })

}

exports.main_UpdateMyAuth_PUT = async (req, res, next) => {

    var loginData = req.body.login
    var emailData = req.body.email
    var paramsID = req.userIds+''
    var resFindUser = await Users.findById(paramsID)

    async.parallel({
        data_byLogin: function(callback) {
            Users.find({login: loginData})
            .then((res_data_byLogin) => {
                callback(null, res_data_byLogin)
            })
            .catch((err_data_byLogin) => {
                callback(null, err_data_byLogin)
            })
        },
        data_byEmail: function(callback) {
            Users.find({email: emailData})
            .then((res_data_byEmail) => {
                callback(null, res_data_byEmail)
            })
            .catch((err_data_byEmail) => {
                callback(null, err_data_byEmail)
            })
        }
    }, async (err, resAllFind) => {
        if(err) {
            console.log('Была допущена ошибка при поиске - ', err)
            return next(err)
        }

        var mass_data_byLogin = resAllFind.data_byLogin.map(el => el._id+'')
        var mass_data_byEmail = resAllFind.data_byEmail.map(el => el._id+'')

        if((Object.keys(mass_data_byLogin).length === 0) && (Object.keys(mass_data_byEmail).length === 0)) {
            console.log('Новые заданные значения для Login и Email остутсвуют в зарегистрированных, записываем новые данные . . .')

            var newUserData = new Users({
                login: loginData,
                email: emailData,
                pass: resFindUser.pass,
                role: resFindUser.role,
                _id: paramsID
            })

            await Users.findByIdAndUpdate(paramsID, newUserData, {})
            .then((resUpdate) => {
                console.log('Успешно обновлено')
                res.sendStatus(200)
            })
            .catch((errUpdate) => {
                console.log('Ошибка при обновлении - ', errUpdate)
                res.sendStatus(505)
            })
        } else {
            if(((Object.keys(mass_data_byLogin).length === 1) && (mass_data_byLogin.includes(paramsID))) || (Object.keys(mass_data_byLogin).length === 0)) {
                console.log('Такая запись есть и она принадлежит этому пользователю, либо, запись отсутствует в БД записываем Login . . .')
                if(((Object.keys(mass_data_byEmail).length === 1) && (mass_data_byEmail.includes(paramsID))) || (Object.keys(mass_data_byEmail).length === 1)) {
                    console.log('Такая запись есть и она принадлежит этому пользователю, либо, запись отсутствует в БД записываем Email . . .')
                    var newUserData = new Users({
                        login: loginData,
                        email: emailData,
                        pass: resFindUser.pass,
                        role: resFindUser.role,
                        _id: paramsID
                    })
    
                    await Users.findByIdAndUpdate(paramsID, newUserData, {})
                    .then((resUpdate) => {
                        console.log('Успешно обновлено')
                        res.sendStatus(200)
                    })
                    .catch((errUpdate) => {
                        console.log('Ошибка при обновлении - ', errUpdate)
                        res.sendStatus(505)
                    })
                } else {
                    console.log('Запись Email уже есть в системе у другого пользователя, возвращаем 404 . . .')
                    res.sendStatus(404)
                }
            } else {
                console.log('Запись Login уже есть в системе у другого пользователя, возвращаем 404 . . .')
                res.sendStatus(404)
            }
        }
    })     
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

exports.listJanrs_GET = async (req, res, next) => {
    await Janrs.find({})
    .then((results) => {
        console.log(results)
        res.render('main_listJanrs', {
            dataJanrs: results
        })
    })
    .catch((errors) => {
        console.log(errors)
        return next(errors)
    })
}

exports.info_janr_GET = async (req, res, next) => {
    await Janrs.findById(req.params.id)
    .then((results) => {
        console.log(results)
        res.render('main_InfoJanr', {
            title: 'Информация о жанре',
            dataJanrItem: results
        })
    })
    .catch((errors) => {
        console.log(errors)
        return next(errors)
    })
};

exports.main_listUsers_GET = async (req, res, next) => {
    async.parallel({
        usersData: function(callback) {
            Users.find({})
            .populate({
                path: "role"
            })
            .then((resUsersData) => {
                callback(null, resUsersData)
            })
            .catch((errUserData) => {
                return next(errUserData)
            })
        },
        usersRolesData: function(callback) {
            Roles.find({})
            .then((resUsersRolesData) => {
                callback(null, resUsersRolesData)
            })
            .catch((errUsersRolesData) => {
                return next(errUsersRolesData)
            })
        }
    }, (errors, result) => {
        if(errors) {
            console.log(errors, 'Еррорсы')
            return next(errors)
        }
        console.log(result, 'Данные пользователей')
        res.render('main_pageUsers', {
            title: 'Список зарегистрированных пользователей',
            dataUsers: result
        })
    })
}

exports.main_infoUser_GET = async (req, res, next) => {
    async.parallel({
        usersData: function(callback) {
            Users.findById({_id: req.params.id})
            .populate({
                path: "role",
                model: Roles
            })
            .then((resUsersData) => {
                callback(null, resUsersData)
            })
            .catch((errUserData) => {
                return next(errUserData)
            })
        },
        usersRolesData: function(callback) {
            Roles.find({})
            .populate({
                path: "values"
            })
            .then((resUsersRolesData) => {
                callback(null, resUsersRolesData)
            })
            .catch((errUsersRolesData) => {
                return next(errUsersRolesData)
            })
        },
        userProfileData: function(callback) {
            UserProfile.find({idUser: req.params.id})
            .then((resUserProfileData) => {
                callback(null, resUserProfileData)
            })
            .catch((errUserProfileData) => {
                return next(errUserProfileData)
            })
        },
        userPlaylistsData: function(callback) {
            PlaylistModel.find({
                userId: req.params.id
            })
            .then((resUserPlaylists) => {
                callback(null, resUserPlaylists)
            })
            .catch((errUsersPlaylists) => {
                return next(errUsersPlaylists)
            })
        }
    }, (errors, result) => {
        if(errors) {
            console.log(errors, 'Еррорсы')
            return next(errors)
        }
        console.log(result, 'Данные пользователей')
        res.render('main_pageUserInfo', {
            title: "Подробнее о пользователе:",
            dataUser: result
        })
    })
}

exports.main_infoUserPlaylistById_GET = async (req, res, next) => {

    try {

        const userID = req.params.idU,
            playlistID = req.params.idP

        async.parallel({
            dataPLaylist: function(callback) {
                PlaylistModel.findById(playlistID)
                .populate({
                    path: 'compositions',
                    model: Compositions
                })
                .populate({
                    path: 'userId',
                    model: Users
                })
                .then((resFoundedPlaylist) => {
                    callback(null, resFoundedPlaylist)
                })
                .catch((errFoundedPlaylist) => {
                    callback(null, errFoundedPlaylist)
                })
            },
        }, (errs, results) => {
            if(errs) {
                console.log('Ошибка при поиске данных о плэйлисте - ', errs)
                return next(errs)
            }
            console.log('Найдено - ', results)
            res.render('main_infoUsersPlaylistById', {
                title: `Плэйлист ${results.dataPLaylist.name} пользователя ${results.dataPLaylist.userId.login}`,
                dataPlaylist: results.dataPLaylist
            })
        })
    } catch(e) {
        console.log('Ошибка при рендере роута - ',e)
        return next(e)
    }
}

exports.mainPage_createMusic_POST = async (req, res, next) => {
    res.send('Создание новогго трека')
}