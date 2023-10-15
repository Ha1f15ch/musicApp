var express = require('express');
var router = express.Router();

const janrs_controller = require('../controllers/janrs.controller')
const users_controller = require('../controllers/users.controller')
const mainPage_controller = require('../controllers/mainPage.controller')
const music_controller = require('../controllers/music.controller')

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware')

router.get('/', [authMiddlevare], mainPage_controller.mainPageData)

router.get('/music', [authMiddlevare], music_controller.mainPage_listMusic_GET)

router.get('/music/:id', [authMiddlevare], music_controller.mainPage_musicDetail_GET)

router.post('/music/create', [authMiddlevare], music_controller.mainPage_createMusic_POST)

router.post('/music/updatePlaylists/:id', [authMiddlevare], music_controller.mainPage_addComposition_inPlaylist_POST)// переписываем бэк и клиента
// реализую по аналогии того, как это сделано на сайте - https://muzofond.fm/personal-music/playlists/434033
// плэйлисты не помечаются чекбоксами (мол композиция уже в плэйлисте, композиции могут дублироваться в плэйлисте) !!!!

router.get('/janrs', [authMiddlevare, CheckUsersProperties.prop_readDicts], mainPage_controller.listJanrs_GET)

router.get('/janrs/:id', [authMiddlevare], mainPage_controller.info_janr_GET)

router.get('/users', [authMiddlevare], mainPage_controller.main_listUsers_GET)

router.get('/users/:id', [authMiddlevare], mainPage_controller.main_infoUser_GET)

router.get('/users/:idU/playlists/:idP', mainPage_controller.main_infoUserPlaylistById_GET)

router.get('/myProfile', [authMiddlevare], mainPage_controller.MyProfile_GET)

router.put('/myProfile/updateProfile', [authMiddlevare], mainPage_controller.MyProfile_PUT)

router.put('/myProfile', [authMiddlevare], mainPage_controller.main_UpdateMyAuth_PUT)

router.get('/myPlaylists/:id', [authMiddlevare], mainPage_controller.myPlaylistDetail_GET)

router.put('/myPlaylists/:id', [authMiddlevare, CheckUsersProperties.prop_editDicts], mainPage_controller.updatePlaylist_name_PUT)

//После добавится апдейт на добавление или удаление композиции из плэйлиста

router.delete('/myPlaylists/:id', [authMiddlevare], mainPage_controller.deletePlaylist_DELETE)

router.get('/myPlaylists', [authMiddlevare], mainPage_controller.list_myPlaylists_GET)

router.post('/myPlaylists', [authMiddlevare], mainPage_controller.createPlaylist_POST)

module.exports = router;