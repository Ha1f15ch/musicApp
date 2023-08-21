var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var compositions = new Schema({
    name: {
        type: String, 
        required: true, 
        unique: true
    },
    rout: {
        type: String, 
        required: true, 
        unique: true
    },
    janrs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Janrs',
            default: null
        }
    ],
    description: {
        type: String,
        required: false
    },
    userIdCreated: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})

compositions
.virtual('getMusic')
.get(function() {
    return '/v1/api/main/music/' + this.id
});

compositions
.virtual('getMusicByAdmin')
.get(function() {
    return '/v1/api/adminCatalog/music/' + this.id
})

module.exports = mongoose.model('Compositions', compositions);