var mongoose = require('mongoose');
var Users = require('../models/users.model');
var Compositions = require('../models/compositions.model');

var Schema = mongoose.Schema;

var playlists = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    compositions: [
        {
            type: Schema.Types.ObjectId,
            ref: Compositions,
            default: null
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: Users
    }
})

playlists
.virtual('getPlaylist')
.get(function() {
    return '/v1/api/main/myPlaylists/' + this._id
});

playlists
.virtual('admin_getPlaylist')
.get(function() {
    return '/v1/api/adminCatalog/myPlaylists/' + this._id
})

playlists
.virtual('getUsersPlaylists')
.get(function() {
    return '/v1/api/main/users/'+ this.userId + '/playlists/' + this._id
})

playlists
.virtual('getUsersPlaylists_admin')
.get(function() {
    return '/v1/api/adminCatalog/users/'+ this.userId._id + '/playlists/' + this._id
})

module.exports = mongoose.model('Playlists', playlists);