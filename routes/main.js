var express = require('express');
var router = express.Router();

const janrs_controller = require('../controllers/janrs.controller')
const users_controller = require('../controllers/users.controller')
const mainPage_controller = require('../controllers/mainPage.controller')
const music_controller = require('../controllers/music.controller')

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware')

router.get('/', [authMiddlevare, CheckUsersProperties.prop_readDicts], (req, res, next) => {
    res.redirect('/v1/api/main')
})

router.get('/v1/api/main', mainPage_controller.mainPageData)

router.get('/v1/api/main/music', music_controller.mainPage_listMusic_GET)

router.get('/v1/api/main/music/:id', music_controller.mainPage_musicDetail_GET)

router.get('/v1/api/main/music/create', music_controller.mainPage_createMusic_GET)

router.post('/v1/api/main/music/create', music_controller.mainPage_createMusic_POST)

router.get('/v1/api/main/music/:id', (req, res, next) => {
    res.send({message: `page composition ${id}`})
})

router.get('/v1/api/main/janrs', [authMiddlevare, CheckUsersProperties.prop_readDicts], janrs_controller.list_janrs)

router.get('/v1/api/main/janrs/janr/:id', janrs_controller.info_janr)

router.get('/v1/api/main/users/', users_controller.list_users)

router.get('/v1/api/main/users/user/:id', users_controller.info_user)

router.get('/v1/api/myProfile', [authMiddlevare], users_controller.info_user_profile)

router.put('/v1/api/myProfile', [authMiddlevare], users_controller.update_info_user_profile)

router.get('/v1/api/myProfile/myPlaylists', (req, res, next) => {
    res.send({message: 'myplaylists'})
})

router.get('/v1/api/myProfile/myPlaylists/:id', (req, res, next) => {
    res.send({message: 'myplaylists + id'})
})

module.exports = router;