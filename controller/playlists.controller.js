var Playlists = require('../models/PlaylistUsers.model')
var Musick = require('../models/testTracks')
const async = require('async');
const jwt = require('jsonwebtoken');
const { secret } = require('../controller/config')
const { validationResult } = require('express-validator');
var User = require('../models/user.model')

//Watch my playlist
exports.myPlaylists_GET = async (req, res, next) => {
    try {
        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData

        let dataFromPlaylist = await Playlists.find({
            UserID_has_Playlist: req.user.id,
        })
            .populate('playListMusick')
            .exec(function(err, results) {
                console.log(results)

                res.render('playlists', {
                    title: 'Список плэйлистов',
                    playlist_list: results, 
                })
            })      

    } catch(e) {
        return next(e)
    }
}

//info about playlist
exports.detailInfoPlaylist_GET = (req, res, next) => {
    
    async.parallel({
        musickFromPlaylist: function(callback) {
            Playlists.findById(req.params.id).
                populate('playListMusick').
                populate('UserID_has_Playlist').
                exec(callback);
        }
    }, function(err, results) {
        if(err) {
            return next(err);
        }
        if(results.musickFromPlaylist == null) {
            res.rdirect('/myPlaylists')
        }   
        res.render("detailPlaylist", {
            title: "Подробное описание плэйлиста",
            MusData: results.musickFromPlaylist
        });
    });
    
};

//Create playlist GET
exports.CreateMyPlaylist_GET = async (req, res, next) => {
    try {
        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData

        let dataFromPlaylist = await Playlists.find({
            UserID_has_Playlist: req.user.id,
        })
            .populate('playListMusick')
            .exec(function(err, results) {
                console.log(results)

                res.render('playlistAdd', {
                        title: 'Создать плэйлист',
                        playlist_list: dataFromPlaylist, 
                    })
            })    
    } catch(e) {
        return next(e)
    }
}

//Create playlist POST
exports.CreateMyPlaylist_POST = [
    
    async (req, res, next) => {
        let tempValTokenHeader = req.headers.cookie.split('token=')[1]
        const decodedData = jwt.verify(tempValTokenHeader, secret)
        req.user = decodedData
        try {
            
            let tempNamePlaylist = req.body.NamePlaylist.replace(/\s/gi, '_')

            const new_playList = await new Playlists({
                NamePlaylistUser: tempNamePlaylist,
                UserID_has_Playlist: req.user.id
            });

            console.log(new_playList + ' Данные из формы')

            new_playList.save((err) => {
                if(err) {
                    return next(err)
                } else {
                    res.redirect('/myPlaylists')
                }
            })

        } catch(e) {
            return next(e)
        }
    }
];

//edit Myplaylist GET
exports.editMyPlaylist_GET = (req, res, next) => {
    async.parallel({
        musickFromPlaylist: function(callback) {
            Playlists.findById(req.params.id).
                exec(callback);
        }
    }, (err, results) => {
        if(err) {
            return next(err)
        };
        if(results.musickFromPlaylist == null) {
            console.log('Плэйлист не найден!!')
            return next(err)
        }
        res.render('playlistEdit', {
            MusData: results.musickFromPlaylist
        });
    })
}

//edit MyPlaylist_POST
exports.editMyPlaylist_POST = [
    (req, res, next) => {
        try {
            let tempNamePlaylist = req.body.NamePlaylist.replace(/\s/gi, '_')

            const MusData = new Playlists({
                NamePlaylistUser: tempNamePlaylist,
                _id: req.params.id
            });

            Playlists.findByIdAndUpdate(req.params.id, MusData, {}, (err, editedplaylist) => {
                if(err) {
                    return next(err)
                };
                res.redirect(editedplaylist.url)
            })

        } catch(e) {
            console.log(e)
            return next(e)
        }
    }
]

//DELETE MYPLAYLIST GET
exports.deleteMyPlaylist_GET = (req, res, next) => {
    try {
            Playlists.findById(req.params.id).
                populate('playListMusick').
                populate('UserID_has_Playlist').
                exec(function(err, musickFromPlaylist) {
                    if(err) {
                        return next(err);
                    }
                    if(musickFromPlaylist == null) {
                        res.redirect('/myPlaylists')
                    }
                    res.render('playlistDelete', {
                        MusData: musickFromPlaylist
                    });
                }) 
    } catch(e) {
        console.log(e)
    } 
}

// DELETE PLAYLIST POST
exports.deleteMyPlaylist_POST = (req, res, next) => {
    try {
        async.parallel({
            playlistDeleting: function(callback) {
                Playlists.findById(req.params.id).exec(callback)
            }, 
        }, function(err, results) {
            if(err) {
                return next(err);
            }
            if(results.playlistDeleting == null) {
                var err = new Error('Данные для удаления не найдены')
                err.status = 404;
                return next(err)
            }
            console.log(results.playlistDeleting, ' - То что удаляем в функции')
            Playlists.findByIdAndRemove(req.params.id, function deleteMyPlylist(err) {
                console.log(req.params.id, 'Удаляемый объект из посленей фунгкции')
                if(err) {
                    return next(err)
                } else {
                    console.log('Удален ID - ', req.params.id)
                    res.redirect('/myPlaylists')
                }
            })
        })
    } catch(e) {
        console.log(e)
    }
}