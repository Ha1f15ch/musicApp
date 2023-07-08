var mongoose = require('mongoose');
var Roles = require('./roles.model')

var Schema = mongoose.Schema;

var rights = new Schema({
    name: {
        type: String, 
    },
});

module.exports = mongoose.model('Rigths', rights);