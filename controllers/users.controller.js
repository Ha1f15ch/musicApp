var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model.js')
const Rights = require('../models/rights.model')

exports.info_user_profile = async (req, res, next) => {

    var token = req.headers.cookie.split('access_token=')[1]
    var valToken = token.split('.')[1]
    var parsToken = valToken.replace(/-/g, '+').replace(/_/g, '/');
    var decodedToken = JSON.parse(Buffer.from(parsToken, 'base64').toString('binary'));

    console.log(decodedToken.id, ' - Определяем для кого выполнен запрос')

    await UserProfile.findOne({idUser: decodedToken.id})
    .then((resProfileData) => {
        console.log('Найдены данные - ', resProfileData)
        res.send(resProfileData)
    })
    .catch((errProfileData) => {
        console.log('Возникла ошибка - ', errProfileData)
        return next(errProfileData)
    })
}

exports.update_info_user_profile = async (req, res, next) => {

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
        res.send(result)
    })
}

exports.info_user = async (req, res, next) => {
    async.parallel({
        usersData: function(callback) {
            Users.find({_id: req.params.id})
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
        }
    }, (errors, result) => {
        if(errors) {
            console.log(errors, 'Еррорсы')
            return next(errors)
        }
        console.log(result, 'Данные пользователей')
        res.send(result)
    })
}

exports.updateUser_get = async (req, res, next) => {
    async.parallel({
        usersData: function(callback) {
            Users.find({_id: req.params.id})
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
        }
    }, (errors, result) => {
        if(errors) {
            console.log(errors, 'Еррорсы')
            return next(errors)
        }
        console.log(result, 'Данные пользователей')
        res.send(result)
    })
}

exports.updateUser_put = async (req, res, next) => {

    var newDataUser = new Users({
        login: req.body.login,
        email: req.body.email,
        role: typeof req.body.listRolesUser === "undefined" ? [] : req.body.listRolesUser,
        _id: req.params.id
    })

    console.log(newDataUser, ' - новы данные')

    if((!req.body.listRolesUser instanceof Array)) {
        if(typeof req.body.listRolesUser === "undefined") {
            req.body.listRolesUser = []
        } else {
            req.body.listRolesUser = new Array(req.body.listRolesUser)
        }
    }

    console.log(req.params, ' - данные из заголовка')

    async.parallel({
        usersData: function(callback) {
            Users.findById({_id: req.params.id})
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
            .populate({
                path: "values"
            })
            .then((resUsersRolesData) => {
                callback(null, resUsersRolesData)
            })
            .catch((errUsersRolesData) => {
                return next(errUsersRolesData)
            })
        }
    }, async (errors, result) => {
        if(errors) {
            console.log(errors, 'Еррорсы')
            return next(errors)
        }

        var allUsersData = await Users.find({_id: {$ne: result.usersData._id}})

        for(let i = 0; i < allUsersData.length; i++) {
            if(allUsersData[i].login == result.usersData.login) {
                console.log(allUsersData[i]._id, ' - данные из цикла')
                console.log('С чем сравниваем - ', result.usersData._id)
                return res.send('Такой логин есть у другого пользователя, выберите другой')
                
            }
        }
        for(let j = 0; j < result.usersRolesData.length; j++) {
            if(newDataUser.role.indexOf(result.usersRolesData[j]._id) > -1) {
                result.usersRolesData[j].checked = "true";
            }
        }

        Users.findByIdAndUpdate(req.params.id, newDataUser, {})
        .then((updateResult) => {
            console.log('Внесены изменения в запись Users - ', updateResult)
            res.redirect(updateResult.url)
        })
        .catch((updateErrors) => {
            console.log('При изменении Users, возникли ошибки - ', updateErrors)
            return next(updateErrors)
        })
    })
}