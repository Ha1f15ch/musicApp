var mongoose = require('mongoose');
var Users = require('../models/users.model');
var Janrs = require('../models/janrs.model');
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
        unique: false
    },
    janrs: [
        {
            type: Schema.Types.ObjectId,
            ref: Janrs,
            default: null
        }
    ],
    description: {
        type: String,
        required: false
    },
    AVGScore: [
        {
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
        }
    ],
    userIdCreated: {
        type: Schema.Types.ObjectId,
        ref: Users
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
    return '/v1/api/adminCatalog/compositions/' + this.id
})

compositions
.virtual('getMyMusic')
.get(function() {
    return '/v1/api/main/myMusic/' + this._id
})

compositions
.virtual('getMyMusicByAdmin')
.get(function() {
    return '/v1/api/adminCatalog/myCompositions/' + this._id
})

compositions
.virtual('AVGValues'
)
.get(function(u_id, m_id) {

})

module.exports = mongoose.model('Compositions', compositions);