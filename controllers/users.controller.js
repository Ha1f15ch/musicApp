var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model.js');
const Rights = require('../models/rights.model');
const PlaylistModel = require('../models/playlist.model');

// Список пользователей 
exports.list_users = async (req, res, next) => {
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
        res.render('pageUsers', {
            title: 'Список зарегистрированных пользователей',
            dataUsers: result
        })
    })
}

exports.info_user = async (req, res, next) => {
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
        res.render('pageUsersInfo', {
            title: "Подробнее о пользователе:",
            dataUser: result
        })
    })
}

exports.updateUser_put = async (req, res, next) => {
    var loginData = req.body.login
    var emailData = req.body.email
    var paramsID = req.params.id
    console.log(emailData, ' - emailData')

    var UserData = await Users.findById({_id: paramsID})
    console.log(UserData)
    var arrayLogin = await Users.find({
        login: loginData
    })
    var arrayEmail = await Users.find({
        email: emailData
    })
    console.log(arrayEmail, ' - email')
    var massIDs = arrayLogin.map((el) => el._id)
    var massValidIDs = massIDs.find((el) => el == paramsID)

    if(massValidIDs.length > 1) {
        console.log(massValidIDs, ' - Введенные данные уже зарегистрированы у другого пользователя')
        res.sendStatus(401)
    }
    console.log(typeof arrayEmail)

    var massIDs_ = arrayEmail.map((el) => el._id)
    var massValidIDs_ = massIDs_.find((el) => el == paramsID)

    if(massValidIDs_ == undefined) {
        console.log('Значение не найдено, записываем в БД')

        var newUserData = new Users({
            login: loginData,
            email: emailData,
            pass: UserData.pass,
            role: UserData.role,
            _id: paramsID
        })
        await Users.findByIdAndUpdate(paramsID, newUserData, {})
        .then((resUpdateUSer) => {
            console.log(resUpdateUSer, ' - Результат пдейта 1')
            /* res.sendStatus(200) */
        })
        .catch((errUpdateUser) => {
            console.log('Ошибка при апдейте - ', errUpdateUser)
            res.sendStatus(401)
        })
        res.sendStatus(200)
    } 

    try {
        if(massValidIDs_.length > 1) {
            console.log(massValidIDs_, ' - Введенные данные уже зарегистрированы у другого пользователя')
            res.sendStatus(401)
        } else {
            var newUserData = new Users({
                login: loginData,
                email: emailData,
                pass: UserData.pass,
                role: UserData.role,
                _id: paramsID
            })
            await Users.findByIdAndUpdate(paramsID, newUserData, {})
            .then((resUpdateUSer) => {
                console.log(resUpdateUSer, ' - Результат пдейта 2')
                res.sendStatus(200)
            })
            .catch((errUpdateUser) => {
                console.log('Ошибка при апдейте - ', errUpdateUser)
                res.sendStatus(401)
            })
        }
    } catch(e) {
        console.log(e, ' - Ошибка')
    }
}

exports.updateUser_profile_put = async (req, res, next) => {
    var paramsID = req.params.id

    async.parallel({
        dataUserProfile: function(callback) {
            UserProfile.find({
                idUser: paramsID
            })
            .then((resFinded) => {
                callback(null, resFinded)
            })
            .catch((errFinded) => {
                callback(null, errFinded)
            })
        }
    }, async (errors, results) => {
        if(errors) {
            console.log('при поиске возникли ошибки - ', errors)
            return next(errors)
        }
        var IdForUpdate = results.dataUserProfile[0]._id
        console.log(IdForUpdate, ' - IdForUpdate')
        console.log(results.dataUserProfile, ' - results.dataUserProfile')
        console.log(req.body.firstNameData, ' - req.body.firstNameData')
        console.log(req.body.lastNameData, ' - req.body.lastNameData')
        console.log(req.body.aboutUserData, ' - req.body.aboutUserData')
        var newUserProfileData = new UserProfile({
            idUser: results.dataUserProfile[0].idUser,
            firstName: req.body.firstNameData,
            lastName: req.body.lastNameData,
            midlName: req.body.midlNameData,
            ageUser: req.body.ageUserData,
            aboutUser: req.body.aboutUserData,
            _id: IdForUpdate
        })

        console.log(newUserProfileData, ' - newUserProfileData')

        await UserProfile.findByIdAndUpdate(IdForUpdate, newUserProfileData, {})
        .then((resUpdated) => {
            console.log('Успешно обновлено - ', resUpdated)
            res.sendStatus(200)
        })
        .catch((errUpdated) => {
            console.log('Ошибка при изменении - ', errUpdated)
            res.sendStatus(401)
        })
    })
}

exports.updateUserRole_put = async (req, res, next) => {
    var paramsID = req.params.id 

    async.parallel({
        userInfo: function(callback) {
            Users.findById({_id: paramsID})
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
        listRoles: function(callback) {
            Roles.find({})
            .then((resFoundedRoles) => {
                callback(null, resFoundedRoles)
            })
            .catch((errFoundedRoles) => {
                callback(null, errFoundedRoles)
            })
        }
    }, async (errors, results) => {
        
        if(errors) {
            console.log(errors)
            return next(errors)
        }
        var flag = true
        console.log(req.body.RoleData)
        if(results.userInfo.role.length < 1) {
            for(let i = 0; i < req.body.RoleData.length; i++) {
                results.userInfo.role.push(req.body.RoleData[i])
                flag = true
                console.log('Флаг дал true')
            }
        } else {
            var tempMassUserRole = results.userInfo.role.map((el) => el._id+'')
            for(let i = 0; i < req.body.RoleData.length; i++) {
                if(tempMassUserRole.includes(req.body.RoleData[i])) {
                    console.log('Такое значение уже есть у пользователя, пропускаем . . .')
                } else {
                    results.userInfo.role.push(req.body.RoleData[i])
                    flag = true
                }
            }
        }
        if(flag) {
            var newUserRole = new Users({
                login: results.userInfo.login,
                email: results.userInfo.email,
                pass: results.userInfo.pass,
                role: results.userInfo.role,
                _id: paramsID
            })
            await Users.findByIdAndUpdate(paramsID, newUserRole, {})
            .then((resUpdated) => {
                console.log(resUpdated, 'Данные обновлены')
                res.sendStatus(200)
            })
            .catch((errUpdated) => {
                console.log(errUpdated, ' - Ошибк при обновлении ролей')
                res.sendStatus(500)
            })
        } else {
            res.sendStatus(402)
        }
        console.log(newUserRole, ' - Новые данные ')
    })
}

exports.update_user_delete_role = async (req, res, next) => {
    var paramsId = req.params.id

    async.parallel({
        dataUser: function(callback) {
            Users.findById(paramsId)
            .populate({
                path: "role",
                model: Roles
            })
            .then((resFound) => {
                callback(null, resFound)
            })
            .catch((errFound) => {
                callback(null, errFound)
            })
        }
    }, async (errs, results) => {
        if(errs) {
            console.log(errs)
            return next(errs)
        }
        for(let i = 0; results.dataUser.role.length; i++) {
            if(results.dataUser.role[i]._id == req.body.deletedRole) {
                let newMassWithRights = results.dataUser.role.filter(value => value._id != req.body.deletedRole)
                
                var updateUser_Delete_role = new Users({
                    login: results.dataUser.login,
                    email: results.dataUser.email,
                    pass: results.dataUser.pass,
                    role: newMassWithRights,
                    createDate: results.dataUser.createDate,
                    _id: paramsId
                })
                await Users.findByIdAndUpdate(paramsId, updateUser_Delete_role, {})
                .then((resUpdated) => {
                    console.log('Успешно обновлено - ', resUpdated)
                    res.sendStatus(200)
                })
                .catch((errUpdated) => {
                    console.log('Апдейт не удался - ', errUpdated)
                    return next(errUpdated)
                })
                break
            } else {
                console.log('Переданное значение не совпадает ни с одним значением у пользователя')
            }
        }
    })
}