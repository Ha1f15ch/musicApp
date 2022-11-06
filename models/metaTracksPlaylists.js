var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IdTracksAndPlaylist = new Schema({
    idPlaylist: {type: Schema.ObjectId, ref: 'Playlist', required: true},
    idTrack: {type: Schema.ObjectId, ref: 'TrackList', required: true}
})

module.exports = mongoose.model('dictId_s', IdTracksAndPlaylist);
//нужен для понимания какой трек в каком плэйлисте, для поиска по ID