var express = require('express')
var router = express.Router()
var MainPageController = require('../controller/MainPageController')


router.get('/home', MainPageController.showAll);

router.get('/myprofile', MainPageController.myProfileLoad_GET);

router.get('/catalog');

module.exports = router