var express = require('express');
var router = express.Router();

const mainPage_controller = require('../controllers/mainPage.controller')
const music_controller = require('../controllers/music.controller')
const user_auth_controller = require('../controllers/users.authorization.controller')

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware');

router.get('/', [CheckUsersProperties.checkReqParameter], mainPage_controller.mainPageData)

router.get('/generalSearch/:value', [CheckUsersProperties.checkReqParameter], mainPage_controller.mainPage_GeneralSearch_value_fromReq_GET)

router.get('/fastSearch/:value', [CheckUsersProperties.checkReqParameter], mainPage_controller.mainPage_fastSearch_value_fromReq)

router.get('/music', [CheckUsersProperties.checkReqParameter], music_controller.mainPage_listMusic_GET)

router.get('/music/:id', [CheckUsersProperties.checkReqParameter], music_controller.mainPage_musicDetail_GET)

router.post('/music/update/:playlistId/:musicID', [authMiddlevare], music_controller.mainPage_addComposition_inPlaylist_POST)// переписываем бэк и клиента

router.get('/janrs', [CheckUsersProperties.checkReqParameter], mainPage_controller.listJanrs_GET)

router.get('/janrs/:id', [CheckUsersProperties.checkReqParameter], mainPage_controller.info_janr_GET)

router.get('/users', [authMiddlevare], mainPage_controller.main_listUsers_GET)

router.get('/users/:id', [authMiddlevare], mainPage_controller.main_infoUser_GET)

router.get('/users/:idU/playlists/:idP', [authMiddlevare], mainPage_controller.main_infoUserPlaylistById_GET)

router.get('/myProfile', [authMiddlevare], mainPage_controller.MyProfile_GET)

router.put('/myProfile/updateProfile', [authMiddlevare], mainPage_controller.MyProfile_PUT)

router.put('/myProfile', [authMiddlevare], mainPage_controller.main_UpdateMyAuth_PUT)

router.get('/myPlaylists/:id', [authMiddlevare], mainPage_controller.myPlaylistDetail_GET)

router.put('/myPlaylists/:id', [authMiddlevare, CheckUsersProperties.prop_editDicts], mainPage_controller.updatePlaylist_name_PUT)

router.put('/myPlaylists/:playlistId/deletemusic', [authMiddlevare], music_controller.mainPage_delete_music_fromPlaylist_PUT)

router.delete('/myPlaylists/:id', [authMiddlevare], mainPage_controller.deletePlaylist_DELETE)

router.get('/myPlaylists', [authMiddlevare], mainPage_controller.list_myPlaylists_GET)

router.post('/myPlaylists', [authMiddlevare], mainPage_controller.createPlaylist_POST)

router.post('/myMusic', [authMiddlevare], music_controller.mainPage_createMusic_POST)

router.get('/myMusic/:id', [authMiddlevare], music_controller.mainPage_MyMusicDetail_GET)

router.get('/myMusic', [authMiddlevare], music_controller.mainPage_myMusic_GET)

router.put('/myMusic/:id', [authMiddlevare], music_controller.mainPage_MyMusic_UPDATE)

router.delete('/myMusic/:id', [authMiddlevare], music_controller.mainPage_deleteMyMusic_DELETE)

router.get('/logOut', [authMiddlevare], user_auth_controller.log_out)

module.exports = router;