var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestMusikList = new Schema({
    name: {type: String, required: true, unique: true},
    rout: {type: String, required: true, unique: true},
    janrs_track: [{type: Schema.ObjectId, ref: "Janrs"}],
    description: {type: String, required: false},
    userIdCreated: {type: Schema.ObjectId, ref: "User"}
})

TestMusikList
.virtual('url')
.get(function() {
    return '/admin_mod/catalog/tracks/' + this.id;
});

module.exports = mongoose.model('TrackList', TestMusikList);