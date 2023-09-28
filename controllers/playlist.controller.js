var Users = require('../models/users.model');
var PlayLists = require('../models/playlist.model');
var Compositions = require('../models/compositions.model');
const async = require('async');

exports.all_playlists_GET = async (req, res, next) => {
    res.send('Custom playlists')
}

exports.detail_playlist_GET = async (req, res, next) => {
    res.send('custom playlist by useriD')
}

exports.all_users_playlists_GET = async (req, res, next) => {
    res.send('users playLists')
}

exports.detail_users_playlist_GET = async (req, res, next) => {
    res.send('detail info about users playlist')
}
