var MainPageController = require('../controller/MainPageController')
const {authJWT} = require('../middleware')


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.get('/home', [authJWT.verifytocen], MainPageController.showAll);

    app.get('/myprofile', MainPageController.myProfileLoad_GET);

    app.get('/catalog');

}
