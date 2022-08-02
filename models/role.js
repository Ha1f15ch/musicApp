var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Role = new Schema({
    value: {type: String, required: true, unique: true, trim: true, default: "USER"},
});

module.exports = mongoose.model('Role', Role);