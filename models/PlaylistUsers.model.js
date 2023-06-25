var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Playlists = new Schema({
    NamePlaylistUser: {type: String, required: true},
    playListMusick: [{type: Schema.ObjectId, ref: "TrackList", default: null}],
    UserID_has_Playlist: {type: Schema.ObjectId, ref: "User"}
});

Playlists
.virtual('url')
.get(function() {
    return '/myPlaylists/' + this._id;
});

module.exports = mongoose.model('Playlists', Playlists);