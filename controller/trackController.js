var Janrs = require('../models/janrs');
var Tracks = require('../models/testTracks');
var Playlists = require('../models/PlaylistUsers.model')
var User = require('../models/user.model')
const fs = require('fs');
const async = require('async');
const {validationResult, Result, body} = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../controller/config')
var dir = "G:/Musik_app/musik_app/public/music";

//SHOW ALL TRACKS
exports.showAllTrack_GET = async function (req, res, next) { //Тестовый вариант

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
                        if (err) throw err
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
                Tracks.find({}).
                    populate('userIdCreated').
                    exec(callback);
            },
            dataMyPlaylist: function(callback) {
                Playlists.find({}).
                    populate('playListMusick').
                    exec(callback);
            },
        }, (err, results) => {
            if (err) {
                return next(err)
            }
            if (results.track == null) {
                console.log(`${results.track} - не найдено ни одного трека, либо нет подходящих данных`)
            }

            res.render('Note_List', {
                title: "All Tracks",
                note: results.track,
                dataPlaylists: results.dataMyPlaylist
            });
        })
    } catch (e) {
        console.log(`Возникла ошибка - ${e}`)
    }
    //Необходимо добавить тестовый трек в БД
};

//Detail info abou mus :ID
exports.detailInfoMus_GET = (req, res, next) => {
    async.parallel({
        track: function (callback) {
            Tracks.findById(req.params.id)
                .populate("janrs_track")
                .exec(callback);
        },
    }, (err, results) => {
        /* console.log(Tracks.findById(req.params.id)) */
        if (err) {
            return next(err);
        }
        if (results.track == null) {
            const err = new Error("Ни одного Трека не найдено");
            err.status = 404;
            return next(err);
        }
        res.render("track_detail", {
            title: "Подробная информация о треке " + results.track.name,
            track: results.track,
        });
    });
};

//Add point for treack, about playlist has track
exports.playlistHAStrack_POST = async (req, res, next) => {
    let tempValTokenHeader = req.headers.cookie.split('token=')[1]
    const decodedData = jwt.verify(tempValTokenHeader, secret)
    req.user = decodedData
    try {
        let dataVal = req.body
        console.log(dataVal, 'Даныне из запроса')
        for(let i = 0; i < dataVal.length; i++) {
            if(dataVal[i][3] == true) {
                console.log('TRUE')
                try {
                    async.parallel({
                        track(callback) {
                            Tracks.findById({
                                _id: dataVal[i][1]
                            }).exec(callback)
                        },
                        playlist(callback) {
                            Playlists.findById({
                                _id: dataVal[i][2]
                            }).exec(callback)
                        }
                    }, (err, results) => {
                        if(err) {
                            return next(err)
                        }
                        if(results.track == null || results.playlist == null) {
                            var err = new Error(`Каких-то данных не достаточно для выввода - ${results.track} - Треки, ${results.playlist} - Плэйлисты`)
                            err.status = 404
                            return next(err);
                        }
                        results.track._id = new Array(results.track._id)
                        console.log(results.track._id, ' - Данные по ID трека, котороый добавляем в БД')
                        console.log(typeof results.playlist.playListMusick)
                        console.log(results.playlist.playListMusick)
                        let newStore = new Playlists({
                            playListMusick: results.track._id,
                            _id: results.playlist
                        })

                        Playlists.findByIdAndUpdate(results.playlist._id, newStore, {}, function(err, dataSend) {
                            if(err) {
                                return next(err)
                            }
                            console.log('Данные были переданы корректно - ', results.playlist, ' - ID плэйлиста', newStore, ' - то, что записали как модель в БД')
                        })
                    })
                } catch(e) {
                    return next(e)
                }
            }
        }
    } catch(e) {
        console.log(e)
    }
};

//Load NEW TRACK GET
exports.AddNewTrack_GET = (req, res, next) => {
    try {
        async.parallel({
            janr(callback) {
                Janrs.find(callback)
            },
        }, (err, results) => {
            if (err) {
                return next(err);
            }
            res.render("track_add", {
                title: "добавление нового трека",
                janr: results.janr
            })
        })
    } catch (e) {
        console.log(e)
    }
};

//Load NEW TRACK POST
exports.AddNewTrack_POST = [
    (req, res, next) => {
        if (!(req.body.data_janr instanceof Array)) {
            if (typeof req.body.data_janr === "undefined") {
                req.body.data_janr = [];
            } else {
                req.body.data_janr = new Array(req.data_janr)
            }
        }
        next();
    },

    body("name_track", "Не может быть пустым")
    .trim()
    .isLength({
        min: 4,
        max: 40
    })
    .escape(),
    body("janrs_track.*").escape(),
    body("description_track", "Не обязательно! Здесь можно описать, чем вдохновлялись при написании трека")
    .trim()
    .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData
        var dataForFind = req.user.id

        const tempMusName = req.files.track.name.replace(/\s/gi, '_')

        const new_note = new Tracks({
            name: req.body.name_track,
            rout: '/music/' + tempMusName,
            janrs_track: req.body.data_janr,
            description: req.body.description_track,
            userIdCreated: dataForFind
        });

        console.log('Данные записываемые в БД - ', new_note)

        if (!errors.isEmpty()) {
            async.parallel({
                    tracks(callback) {
                        Tracks.find(callback);
                    },
                    janr(callback) {
                        Janrs.find(callback)
                    },
                },
                (err, results) => {
                    if (err) {
                        return next(err)
                    }

                    console.log('ЛОГ РЕЗАЛТ - ', results)

                    for (const janr_data of results.janr) {
                        if (new_note.janrs_track.includes(janr_data._id)) {
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
            if (err) {
                return next(err);
            } else {
                try {
                    /* fs.rename(req.files.track.name, tempMusName, errs => {
                        if(errs) throw errs
                        console.log('Правки внесены успешно')
                    }) */
                    req.files.track.mv('public/music/' + tempMusName, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Выполнено преобразование из - ', req.files.track.name, ' в - ', tempMusName)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
                res.redirect(new_note.url);
            }
        });
    },
];

//Edit track GET ID
exports.EditMus_GET = (req, res, next) => {

    async.parallel({
        track: function(callback) {
            Tracks.findById(req.params.id)
                .populate("janrs_track")
                .exec(callback)
        },
        janrs: function(callback) {
            Janrs.find(callback)
        }
    }, (err, results) => {
        if(err) {
            return next(err)
        }
        if(results.track == null) {
            var err = new Error('Трека не найдено!!')
            err.status = 404
            return next(err);
        }

        for(var allJanrs = 0; allJanrs < results.janrs.length; allJanrs++) {
            for(var Track_sJanr = 0; Track_sJanr < results.track.janrs_track.length; Track_sJanr++) {
                if(results.janrs[allJanrs]._id.toString() === results.track.janrs_track[Track_sJanr]._id.toString()) {
                    results.janrs[allJanrs].checked = "true";
                }
            }
        }
        res.render('update_track_by_id', {
            title: 'Обновить данные о треке',
            janrs: results.janrs,
            trackObj: results.track
        });
    });
};
//Edit track POST ID
exports.EditMus_POST = [
    (req, res, next) => {
        if(!(req.body.janrs_track instanceof Array)) {
            if(typeof req.body.janrs_track === "undefined") {
                req.body.janrs_track = []
            } else {
                req.body.janrs_track = new Array(req.body.janrs_track);
            }
        }
        next();
    },
    body("name", "Не должно быть пустым или менее 4 символов")
        .trim()
        .isLength({min: 4})
        .escape(),
    body("janrs_track.*").escape(),
    body("description", "Не более 150 символов")
        .trim()
        .isLength({max: 150})
        .escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var trackObj = new Tracks({
            name: req.body.name,
            janrs_track: typeof req.body.janrs_track === "undefined" ? [] : req.body.janrs_track,
            description: req.body.description,
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            async.parallel({
                janrs: function(callback) {
                    Janrs.find(callback);
                }
            }, (err, results) => {
                if(err) {
                    return next(err)
                }

                for(let i = 0; i < results.janrs.length; i++) {
                    if(trackObj.janrs_track.indexOf(results.janrs[i]._id) > -1) {
                        results.janrs[i].checked = "true";
                    }
                }
                res.render("update_track_by_id", {
                    title: 'Изменение данных о треке....',
                    janrs: results.janrs,
                    trackObj: trackObj,
                    errors: errors.array(),
                });
            });
            return;
        } else {
            Tracks.findByIdAndUpdate(req.params.id, trackObj, {}, function(err, dataTrack) {
                if(err) {
                    return next(err);
                }
                res.redirect(dataTrack.url)
            });
        }
    },
];

//Delete mus GET ID
exports.DeleteMus_GET = (req, res, next) => {
    Tracks.findById(req.params.id)
        .exec(function (err, trackData) {
            if (err) {
                return next(err);
            }
            if (trackData == null) {
                res.redirect("/admin_mod/catalog/tracks/allNotes")
            }
            res.render('delete_track_by_id', {
                title: 'Удаляем трек...',
                trackData: trackData
            });
        });
};

//Delete mus POST ID
exports.DeleteMus_POST = (req, res, next) => {
    
    async.parallel({
        dataTrack: function(callback) {
            Tracks.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        }
        if(results.dataTrack == null) {
            var err = new Error('Данных не найдено!!');
            err.status = 404;
            return next(err);
        }
        
        const nameTemp = results.dataTrack.rout+''
        var name = 'G:\\Musik_app\\musik_app\\public\\music\\' + nameTemp.split('/music/')[1]
        console.log(typeof name)
        console.log(name)
        fs.unlink(name, function (err) {
            if (err) {
                return next(err);
            }
        })
    })

    Tracks.findByIdAndRemove(req.params.id, function deleteTrack(err) {
        if (err) {
            return next(err);
        }
    })
    res.redirect('/admin_mod/catalog/tracks/allNotes')
};