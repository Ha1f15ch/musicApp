var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var user = new Schema({
    username: {type: String, require: true, unique: true},
    email: {type: String, required: true, unique: true, trim: true},
    pass: {type: String, required: false, trim: true},
    role: [{type: String, ref: 'Role'}]
});

user
.virtual('url')
.get(function() {
    return '/main/Home'
});

module.exports = mongoose.model('User', user);