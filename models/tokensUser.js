var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tokenSchema = new Schema({
    idUser: {type: Schema.ObjectId, ref: 'Guest', required: true},
    token: {type: String, required: true}
})

module.exports = mongoose.model('UserToken', tokenSchema);

