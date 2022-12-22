const {verifySignUp} = require('../middleware')
const AuthController = require('../controller/authorization.controller')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRoleExisted], AuthController.sigup);
    app.post('/auth/signin', AuthController.signin);
    app.post('/auth/refreshToken', AuthController.refreshToken);
}