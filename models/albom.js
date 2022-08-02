var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var albomSchema = new Schema({
    NameAlbom: {type: String, required: true, unique: true},
    YearRelis: {type: Date, required: true},
    Janrs: [{type: String, ref: 'Janrs'}],
    AlbomDescription: {type: String, required: false}
})

albomSchema

module.exports = mongoose.model('Alboms', albomSchema)