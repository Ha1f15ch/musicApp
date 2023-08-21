var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var janrs = new Schema({
    name: {type: String, required: true, unique: true},
    descriptions: {type: String, required: false}
});

janrs
.virtual('janrId')
.get(function() {
    return '/v1/api/adminCatalog/janrs/' + this._id
})

module.exports = mongoose.model('Janrs', janrs)