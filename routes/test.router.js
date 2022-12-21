const {authJWT} = require('../middleware')
const controller = require('../controller/test.controller')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.get("/test/all", controller.allAccess);
    app.get("/test/users", [authJWT.verifytocen], controller.userBoard);
    app.get("/test/modder", [authJWT.verifytocen, authJWT.isModerator], controller.modderAccess);
    app.get("/test/admin", [authJWT.verifytocen, authJWT.isAdmin], controller.adminAccess);
}