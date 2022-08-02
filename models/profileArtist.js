var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var profileArtistShema = new Schema({
    login: {type: String, required: true, unique: true, trim: true},
    pass: {type: String, required: true, trim: true},
    role: [{type: String, ref: 'Role', default: "ARTIST"}]
})

profileArtistShema

module.exports = mongoose.model('Artist', profileArtistShema);