var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Playlists = new Schema({
    NamePlaylistUser: {type: String, required: true},
    UserID_has_Playlist: {type: Schema.ObjectId, ref: "User"}
});

Playlists
.virtual('url')
.get(function() {
    return '/userProfile/playlists'
});

module.exports = mongoose.model('Playlists', Playlists);