var express = require('express')
var router = express.Router()
var MainPageController = require('../controller/MainPageController')
var authMidleware = require('../middleware/authMidleware')

const roleMidleware = require('../middleware/roleMidleware')

router.get('/home',authMidleware, MainPageController.showAll);

router.get('/myprofile', authMidleware, MainPageController.myProfileLoad_GET);

module.exports = router