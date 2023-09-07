var async = require('async');
const Users = require('../models/users.model');
const UserProfile = require('../models/user.profile.model');
const Roles = require('../models/roles.model');
const janrs = require('../models/janrs.model');

exports.mainPage_GET = async (req, res, next) => {
    res.render('adminPage', {
        title: 'Главная страница администрации'
    })
}