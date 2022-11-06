var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    namePlaylist: {type: String, required: true, uniqe: false},
})

playlistSchema

module.exports = mongoose.model('Playlist', playlistSchema)