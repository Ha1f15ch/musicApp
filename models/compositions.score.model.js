var mongoose = require('mongoose');
var Users = require('../models/users.model');
var Compositions = require('../models/compositions.model');

var Schema = mongoose.Schema;

var compositionsScore = new Schema({
    m_id: {
        type: Schema.Types.ObjectId,
        ref: Compositions,
        default: null
    },
    u_id: {
        type: Schema.Types.ObjectId,
        ref: Users,
        default: null,
        required: false,
        unique: false
    },
    value: {
        type: Number,
        max: 5,
        default: null,
        required: false,
        unique: false
    }
})

module.exports = mongoose.model('CompositionsScore', compositionsScore)