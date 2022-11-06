var Janrs = require('../models/janrs');
const async = require('async');
const validator = require('express-validator');
const { ValidationHalt } = require('express-validator/src/base');
const { validationResult } = require('express-validator');

//SHOW JANR
exports.showJanr_GET = async function(req, res, next) {
    try {
        const janrs = await Janrs.find()
        res.render('janrs', {title: "Жанры музыки", janrs_list: janrs});
    } catch (e) {
        console.log(e)
    }
};

//JANR DETAILED BY ID
exports.janrDetaled_GET = (req, res, next) => {
    async.parallel({
        janr(callback) {
            Janrs.findById(req.params.id).exec(callback);
        },
    }, (err, results) => {
        if(err) {return next(err);}
        if(results.janr == null) {
            const err = new Error('Такого жанра нет!')
            err.status = 404;
            return next(err)
        }
        res.render('detal_info_janr_admin', {title: 'Подробнее о жанре', janr: results.janr})
    })
}

// ADD JANR GET 
exports.addJanr_GET = async function(req, res, next) {
    try {
        const janrs = await Janrs.find()
        res.render('janrs_add', {title: "Жанры музыки", janrs_list: janrs});
    } catch (e) {
        console.log(e)
    }
};

// ADD JANR POST
exports.addJanr_POST = [
    validator.body('janrName', 'Укажите название жанра').trim().isLength({min: 3}),
    validator.body('janrDescriptions', 'Описание жанра').trim().isLength({min: 0}),
    validator.sanitize('janrName').escape(),
    validator.sanitize('janrDescriptions').escape(),

    (req, res, next) => {
        const errors = validator.validationResult(req);

        var genre_mus = new Janrs({
            janrName: req.body.janrName,
            janrDescriptions: req.body.janrDescriptions
        });

        if(!errors.isEmpty()) {
            res.render('janrs_add', {title: "Жанры музыки", janrs_list: genre_mus, errors: errors.array()});
            return;
        } else {
            Janrs.findOne({
                'janrName' : req.body.janrName
            })
            .exec(function(err, founded_genre) {
                if(err) {return next(err)}
                if(founded_genre) {
                    res.redirect(founded_genre.aboutJanr)
                } else {
                    genre_mus.save(function(err) {
                        if(err) {return next(err);}
                        res.redirect('/admin_mod/catalog/janrs');
                    })
                }
            })
        }
    }
]

//EDIT JANR GET
exports.editJanr_GET = (req, res, next) => {
    async.parallel({
        janr(callback) {
            Janrs.findById(req.params.id).exec(callback);
        }
    }, (err, results) => {
        if(err) {return next(err);}
        if(results.janr == null) {
            const err = new Error('Жанр не обнаружен!');
            err.status = 404;
            return next(err);
        }
        res.render('update_janr_by_id', {title: `Изменение жанра ${results.janrName}`, janr_data: results.janr});
    });
};

//EDIT JANR POST
exports.editJanr_POST = [

    validator.body("janrName", "Название жанра не может быть пустым!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    validator.body("janrDescriptions", "Опишите жанр")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    (req, res, next) => {

        const errors = validationResult(req);

        const janr_data = new Janrs({
            janrName: req.body.janrName,
            janrDescriptions: req.body.janrDescriptions,
            _id: req.params.id,
        });
        if(!errors.isEmpty()) {
            async.parallel({
                
            }, (err, results) => {
                res.render('update_janr_by_id', {title: 'Изменение жанра', janr_data: janr, errors: errors.array()})
            }); 
            return;
        }
        Janrs.findByIdAndUpdate(req.params.id, janr_data, {}, (err, updated_janr) => {
            if(err) {return next(err);}
            res.redirect('/admin_mod/catalog'+updated_janr.aboutJanr)
        })
}]

//DELETE JANR GET
//Если в будущем будут реализованы еще таблицы, связанныйе с жанрами - например трэк лист
    //подробная инфа о треке, нужно дорабатывать проверку на принадлежность exist
exports.deleteJanr_GET = function(req, res, next) {
    try {
        async.parallel({
            janr: function(callback) {
                Janrs.findById(req.params.id).exec(callback)
            },
        }, function(err, results) {
            if(err) {return next(err);}
            if(results.janr==null) {
                res.redirect('/admin_mod/catalog/janrs');
            }
            res.render('delete_janr_by_id', {janr: results.janr});
        })
    } catch(e) {
        console.log(e)
    }
};

//DELETE jANR POST
exports.deleteJanr_POST = function(req, res, next) {
    try {
        async.parallel({
            janr: function(callback) {
                Janrs.findById(req.body.janrid).exec(callback)
            },
        }, function(err, results) {
            if(err) {return next(err);}
            else {
                Janrs.findByIdAndRemove(req.body.janrid, function deleteJanr(err) {
                    if(err) {return next(err);}
                    res.redirect('/admin_mod/catalog/janrs')
                })
            }
        })
    } catch(e) {
        console.log(e)
    }
};

