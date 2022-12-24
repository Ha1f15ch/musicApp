var express = require('express')
var router = express.Router()
var MainPageController = require('../controller/MainPageController')
const {authJWT} = require('../middleware')


router.get('/home', [authJWT.verifytocen], MainPageController.showAll);

router.get('/myprofile', MainPageController.myProfileLoad_GET);

router.get('/catalog');

module.exports = router