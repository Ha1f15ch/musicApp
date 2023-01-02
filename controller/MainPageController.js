var Guest = require('../models/user.model')
var UserProfile = require('../models/profileUser')

exports.showAll = function(req, res, next) {

    Guest.find({}, 'login pass')
    .exec(function(err, User_data) {
        console.log(User_data)
        if(err) {return next(err)}
        res.render('MainPage', {title: 'Главная страница', Udata: User_data})
    });
};

exports.myProfileLoad_GET = function(req, res, next) {
    res.render('profileHalf')
}