const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');
const Roles = require('../models/roles.model');
const Rights = require('../models/rights.model');

// Чтение справочников
prop_readDicts = (req, res, next) => {
    console.log(req.userIds, 'Узнаем id пользователя из параметрав запроса')
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Чтение справочника') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Чтение справочника')
            } else {
                console.log('Необходимое право есть - Чтение справочника')
                return next()
            }
        }
        console.log('Необходимого права нет - Чтение справочника')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

// Доступ к разделу администрирования
prop_administrationPanel = (req, res, next) => {
    console.log(req.userIds)
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Доступ к разделу администрирования') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Доступ к разделу администрирования')
            } else {
                console.log('Необходимое право есть - Доступ к разделу администрирования')
                return next()
            }
        }
        console.log('Необходимого права нет - Доступ к разделу администрирования')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

// Доступ к профилю пользователя
prop_getProfileUser = (req, res, next) => {
    console.log(req.userIds)
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Доступ к профилю пользователя') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Доступ к профилю пользователя')
            } else {
                console.log('Необходимое право есть - Доступ к профилю пользователя')
                return next()
            }
        }
        console.log('Необходимого права нет - Доступ к профилю пользователя')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

// Доступ к загрузке файла
prop_loadFile = (req, res, next) => {
    console.log(req.userIds)
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Доступ к загрузке файла') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Доступ к загрузке файла')
            } else {
                console.log('Необходимое право есть - Доступ к загрузке файла')
                return next()
            }
        }
        console.log('Необходимого права нет - Доступ к загрузке файла')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

// Доступ к изменению справочников
prop_editDicts = (req, res, next) => {
    console.log(req.userIds)
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Доступ к изменению справочников') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Доступ к изменению справочников')
            } else {
                console.log('Необходимое право есть - Доступ к изменению справочников')
                return next()
            }
        }
        console.log('Необходимого права нет - Доступ к изменению справочников')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

// Доступ к редактированию роли пользователя
prop_editUsersRoles = (req, res, next) => {
    console.log(req.userIds)
    Users.findById({
        _id: req.userIds
    })
    .populate({
        path: "role",
        populate: {
            path: "values"
        }
    })
    .then((userData) => {
        console.log(userData, 'Пользователь найден')
        
        for(let i = 0; i < userData.role[0].values.length; i++) {
            if(userData.role[0].values[i].name != 'Доступ к редактированию роли пользователя') {
                console.log(userData.role[0].values[i]._id, ' - не равно - Доступ к редактированию роли пользователя')
            } else {
                console.log('Необходимое право есть - Доступ к редактированию роли пользователя')
                return next()
            }
        }
        console.log('Необходимого права нет - Доступ к редактированию роли пользователя')
        return res
        .status(404)
        .send('У Вас недостаточно прав для просмотра данной страницы')
    })
    .catch((errorsData) => {
        console.log('У Вас недостаточно прав для просмотра данной страницы')
        console.log(errorsData)
        return res.status(404).redirect('/')
    })
}

const CheckUsersProperties = {
    prop_readDicts,
    prop_administrationPanel,
    prop_editDicts,
    prop_editUsersRoles,
    prop_getProfileUser,
    prop_loadFile
}

module.exports = CheckUsersProperties;