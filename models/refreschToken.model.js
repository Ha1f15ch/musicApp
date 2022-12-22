const mongoose = require('mongoose')
const config = require('../controller/config')
const { v4: uuidv4 } = require('uuid');


const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    expiredDate: Date,
});

RefreshTokenSchema.statics.createToken = async function(user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtExpiration);

    let _token = uuidv4();

    let _object = new this({
        token: _token,
        user: user._id,
        expiredDate: expiredAt.getTime(),
    });
    console.log(_object);

    let refreshToken = await _object.save();

    return refreshToken.token
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiredDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreschToken", RefreshTokenSchema);
module.exports = RefreshToken;