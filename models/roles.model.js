var mongoose = require('mongoose');
var Rights = require('./rights.model')

var Schema = mongoose.Schema;

var roles = new Schema({
    name: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true
    },
    values: [
        {
            type: Schema.Types.ObjectId,
            ref: 'rights',
            default: null
        }
    ]
});

roles

module.exports = mongoose.model('Roles', roles);