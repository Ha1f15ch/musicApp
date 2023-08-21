var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userProfile = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    firstName: {
        type: String,
        required: false, 
        trim: true,
        default: null
    },
    lastName: {
        type: String,
        required: false, 
        trim: true,
        default: null
    },
    midlName: {
        type: String,
        required: false, 
        trim: true,
        default: null
    },
    ageUser: {
        type: Number,
        required: false,
        trim: true,
        default: null
    },
    aboutUser: {
        type: String,
        required: false,
        default: null
    }
});

module.exports = mongoose.model('UserProfile', userProfile)