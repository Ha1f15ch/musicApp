var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var users = new Schema({
    login: {
        type: String, 
        require: true, 
        unique: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true
    },
    pass: {
        type: String, 
        required: false, 
        trim: true
    },
    role: [
        {
            type: String, 
            ref: 'Roles'
        }
    ]
});

//возможно буду допиливать
users
.virtual('url')
.get(function() {
    return '/v1/api/main/users/user/' + this._id
});

module.exports = mongoose.model('Users', users);