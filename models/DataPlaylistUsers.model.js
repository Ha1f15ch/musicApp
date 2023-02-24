var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var DataPlaylistUsers = new Schema({
    IdPLaylist: {type: Schema.ObjectId, ref: 'Playlists'},
    IdTrack: {type: Schema.ObjectId, ref: 'TrackList'}
});

module.exports = mongoose.model('DataPlaylist', DataPlaylistUsers)