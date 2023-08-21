var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlists = new Schema({
    name: {
        type: String,
        required: true
    },
    compositions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Compositions',
            default: null
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})

playlists
.virtual('getPlaylist')
.get(() => {
    return '/v1/api/myProfile/myPlaylists/' + this._id
});

playlists
.virtual('getPlaylistByAdmin')
.get(() => {
    return 'users/'+ this.userId + '/playlists/' + this._id
})

module.exports = mongoose.model('Playlists', playlists);