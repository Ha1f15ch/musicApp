var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var janrMusicShema = new Schema({
    janrName: {type: String, required: true, unique: true},
    janrDescriptions: {type: String, required: false}
});

janrMusicShema
.virtual('NAME')
.get(function() {
    return this.janrName
})

janrMusicShema
.virtual('aboutJanr')
.get(function() {
    return '/janrs/' + this._id
})

module.exports = mongoose.model('Janrs', janrMusicShema);