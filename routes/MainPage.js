var express = require('express')
var router = express.Router()
var MainPageController = require('../controller/MainPageController')
var testConstoller = require('../controller/testController')
var authMidleware = require('../middleware/authMidleware')
var roleMiddlevare = require('../middleware/roleMidleware')


router.get('/home',authMidleware, MainPageController.showAll);

router.get('/myprofile', authMidleware, MainPageController.myProfileLoad_GET);

router.get('/test', /* roleMiddlevare, */ testConstoller.AllMusik_GET);

module.exports = router