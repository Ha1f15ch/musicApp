var express = require('express')
var router = express.Router()
var MainPageController = require('../controller/MainPageController')

const roleMidleware = require('../middleware/roleMidleware')

router.get('/home', MainPageController.showAll);

router.get('/myprofile', MainPageController.myProfileLoad_GET);

module.exports = router