var Janrs = require('../models/janrs');
var Albom = require('../models/albom');
var Tracks = require('../models/testTracks');
const fs = require('fs');
const path = require('path');
const async = require('async');
const validator = require('express-validator');
const {ValidationHalt} = require('express-validator/src/base');
const {validationResult, Result, body} = require('express-validator');
const { title } = require('process');
const multer = require('multer')
const e = require('express');
const { encode } = require('querystring');
var dir = "G:/Musik_app/musik_app/public/music";

//SHOW ALL TRACKS
exports.showAllTrack_GET = async function (req, res, next) {//Тестовый вариант

    try {

        var getFiles = function (dir, files_) {

            files_ = files_ || [];
            var files = fs.readdirSync(dir);
            for (var i in files) {
                var name = dir + '/' + files[i];
                if (fs.statSync(name).isDirectory()) {
                    getFiles(name, files_)
                } else {
                    // var re = / /g;
                    var newName = name.replace(/\s/gi, '_')
                        fs.rename(name, newName, err => {
                            if(err) throw err
                            console.log('Успешно переименовано')
                        })
                    var files2 = name.split('/public')[1]
                    files_.push(files2);
                }
            }
            return files_;
        };
        console.log(getFiles(dir))
        res.render('ListMus', {
            title: 'Все треки',
            data: getFiles(dir),
        })
    }
    //console.log(getFiles(dir))
    catch (e) {
        return next(e)
    }


};

//LOAD ALL TRACKS FROM DIR
exports.allTrack_GET = (req, res, next) => {
    try {
        async.parallel({
            track(callback) {
                Tracks.find().exec(callback);
            },
        }, (err, results) => {
            if(err) {return next(err)}
            if(results.track == null) {
                console.log(`${results.track} - не найдено ни одного трека, либо нет подходящих данных`)
                /* const err = new Error(`Не найдено ни одного трека, либо нет подходящих данных`)
                err.status = 404; */
            }

            res.render('Note_List', {
                title: "All Tracks", 
                note: results.track});
        })
    } catch(e) {
        console.log(`Возникла ошибка - ${e}`)
    }
    //Необходимо добавить тестовый трек в БД
};

//Detail info abou mus :ID
exports.detailInfoMus_GET = (req, res, next) => {
    async.parallel({
        track: function(callback) {
            Tracks.findById(req.params.id)
            .populate("janrs_track")
            .exec(callback);
        },
    }, (err, results) => {
        /* console.log(Tracks.findById(req.params.id)) */
        if(err) {
            return next(err);
        }
        if(results.track == null) {
            const err = new Error("Ни одного жанра не найдено");
            err.status = 404;
            return next(err);
        }
        res.render("track_detail", {
            title: "Подробная информация о треке " + results.track.name,
            track: results.track,
        });
    });
};

//Load NEW TRACK GET
exports.AddNewTrack_GET = (req, res, next) => {
    try{
        async.parallel({
            janr(callback) {
                Janrs.find(callback)
            },
        }, (err, results) => {
            if(err) {
                return next(err);
            }
            res.render("track_add", {
                title: "добавление нового трека",
                janr: results.janr
                })
        })
    } catch(e) {
        console.log(e)
    }
};

//Load NEW TRACK POST
exports.AddNewTrack_POST = [
    (req, res, next) => {
        console.log('Что попадает в самом начале - ', req.body.data_janr)
        if(!(req.body.data_janr instanceof Array)) {
            console.log('Данные о том, что попало в перебор из реквеста', req.body.data_janr)
            if(typeof req.body.data_janr === "undefined") {
                console.log('Внутри цикла перебор реквестов - ', req.body.data_janr)
                req.body.data_janr = [];
            }
            else {
                console.log('Что выходит в итоге - ', req.data_janr)
                req.body.data_janr = new Array(req.data_janr)
            }
        }
        next();
    },

    body("name_track", "Не может быть пустым")
        .trim()
        .isLength({min: 4, max: 40})
        .escape(),
    body("janrs_track.*").escape(),
    body("description_track", "Не обязательно! Здесь можно описать, чем вдохновлялись при написании трека")
        .trim()
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const new_note = new Tracks({
            name: req.body.name_track,
            rout: '/music/' + req.files.track.name,
            janrs_track: req.body.data_janr,
            description: req.body.description_track
        });

        console.log('Данные записываемые в БД - ',new_note)

        if(!errors.isEmpty()) {
            async.parallel({
                tracks(callback) {
                    Tracks.find(callback);
                },
                janr(callback) {
                    Janrs.find(callback)
                },
            },
            (err, results) => {
                if(err) {
                    return next(err)
                }

                console.log('ЛОГ РЕЗАЛТ - ',results)

                for(const janr_data of results.janr) {
                    if(new_note.janrs_track.includes(janr_data._id)) {
                        janr_data.checked = "true";
                    }
                }

                // console.log(results)

                res.render('track_add', {
                    title: "Создание трека",
                    tracks_values: results.tracks,
                    janr: results.janr,
                    new_note,
                    errors: errors.array(),
                });
            });
            return;
        }

        new_note.save((err) => {
            if(err) {
                return next(err);
            } else {
                try {
                    req.files.track.mv('public/music/' + req.files.track.name, (err) => {
                        if(err) {
                            console.log(err)
                        } else {
                            console.log('Выполнено! - ', req.files.track.name)
                        }
                    })
                } catch(e) {
                    console.log(e)
                }
                res.redirect(new_note.url);}
        });
    },
];

//Edit track GET ID
exports.EditMus_GET = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Edit track GET ID`
    })
};

//Edit track POST ID
exports.EditMus_POST = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Edit track POST ID`
    })
};

//Delete mus GET ID
exports.DeleteMus_GET = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Delete mus GET ID`
    })
};

//Delete mus POST ID
exports.DeleteMus_POST = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Delete mus POST ID`
    })
};