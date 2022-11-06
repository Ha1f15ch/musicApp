var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TestMusikList = new Schema({
    name: {type: String, required: true, unique: true},
    rout: {type: String, required: true, unique: true},
    janrs_trak: [{type: Schema.ObjectId, ref: 'Janrs', default: "ТестЖанр"}]
})

TestMusikList
.virtual('url')
.get(function() {
    return '/catalog/mus_file/' + this.id;
});

module.exports = mongoose.model('TrackList', TestMusikList);