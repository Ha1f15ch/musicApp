var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roleSchema = new Schema({
    value: {type: String, /* required: true, */ unique: true, trim: true}, //USER ADMIN MODDER
});

/* Role
.virtual('ids')
.get(function() {
    return this._id
}); */

module.exports = mongoose.model('Role', roleSchema);