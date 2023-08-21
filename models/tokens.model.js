const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');
const configSettings = require('../models/configSettings')

var Schema = mongoose.Schema;

var refreschTokens = new Schema({
    token: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    expiredDate: {
        type: Date
    }
});

refreschTokens.statics.createToken = async function(userIdFromToken) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + configSettings.jwtRefreshExpiration);

    let _token = uuidv4();

    let _object = new this({
        token: _token,
        userId: userIdFromToken,
        expiredDate: expiredAt.getTime(),
    });

    console.log('Данные из модели токенов, token - это рефреш токен из БД' + _object);

    let refreschToken = await _object.save();
    return refreschToken.token
}

refreschTokens.statics.verifyExpiration = (token) => {
    return token.expiredDate.getTime() < new Date().getTime();
}

const RefreschToken = mongoose.model("RefreschToken", refreschTokens);
module.exports = RefreschToken;