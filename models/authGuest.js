var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var authUserSchema = new Schema({
    login: {type: String, required: true, unique: true, trim: true},
    pass: {type: String, required: true, trim: true},
    role: [{type: String, ref: 'Role'}]
});

authUserSchema
.virtual('url')
.get(function() {
    return '/main/Home'
});

module.exports = mongoose.model('Guest', authUserSchema);