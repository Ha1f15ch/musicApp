var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestMusiList = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = mongoose.model('TrackList', TestMusiList);