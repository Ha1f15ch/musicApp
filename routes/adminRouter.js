var express = require('express');
var router = express.Router();

const rights_controller = require('../controllers/rights.controller'); 
const roles_controller = require('../controllers/roles.controller.js');
const janrs_controller = require('../controllers/janrs.controller');
const users_controller = require('../controllers/users.controller');
const adminPage_controller = require('../controllers/adminPage.controller');
const playlist_controller = require('../controllers/playlist.controller');
const music_controller = require('../controllers/music.controller');

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware')

router.get('/', adminPage_controller.mainPage_GET)

router.get('/myProfile', [authMiddlevare], adminPage_controller.MyProfile_GET)

router.put('/myProfile', [authMiddlevare], adminPage_controller.admin_UpdateMyAuth_PUT)

router.put('/myProfile/updateProfile', [authMiddlevare], adminPage_controller.MyProfile_PUT)

router.get('/myPlaylists/:id', [authMiddlevare], adminPage_controller.myPlaylistDetail_GET)

router.put('/myPlaylists/:id', [authMiddlevare, CheckUsersProperties.prop_editDicts], adminPage_controller.updatePlaylist_name_PUT)

//После добавится апдейт на добавление или удаление композиции из плэйлиста
router.put('/myPlaylists/:playlistId/deletemusic', [authMiddlevare], music_controller.adminPAge_delete_music_fromPlaylist_PUT)

router.delete('/myPlaylists/:id', [authMiddlevare], adminPage_controller.deletePlaylist_DELETE)

router.get('/myPlaylists', [authMiddlevare], adminPage_controller.list_myPlaylists_GET)

router.post('/myPlaylists', [authMiddlevare], adminPage_controller.createPlaylist_POST)

router.get('/users', users_controller.list_users)

router.get('/users/:id', [authMiddlevare], users_controller.info_user)

router.put('/users/:id/update', users_controller.updateUser_put)

router.put('/users/:id/updateProfile', users_controller.updateUser_profile_put)

router.put('/users/:id/updateRole', users_controller.updateUserRole_put)

router.put('/users/:id/deleteRole', users_controller.update_user_delete_role)

router.get('/users/:idU/playlists/:idP', playlist_controller.detail_users_playlist_GET)

//Написать роут для изменения плэйлиста (как название, так и содержание - удаление треков из плэйлиста)
router.put('/users/:idU/playlists/:idP/updateName', [authMiddlevare], playlist_controller.adminPage_updatePlaylist_name_byUserId_PUT)

//Написать роут на удаление плэйлиста, все по пути users/:id/playlists/id
router.put('/users/:idU/playlists/:idP/deletemusic', [authMiddlevare], music_controller.adminPAge_delete_music_fromPlaylist_byUserId_PUT)

router.delete('/users/:idU/playlists/:idP', [authMiddlevare], playlist_controller.adminPage_deletePlaylist_byUserId_DELETE)

//Написать роуты на изменение и удаление и т.д. для пути - playlists/:id
router.put('/playlists/:id/updateName', [authMiddlevare], playlist_controller.adminPage_updatePlaylist_name_PUT)

router.put('/playlists/:id/deletemusic', [authMiddlevare], music_controller.adminPAge_delete_music_fromPlaylist_PUT)

router.delete('/playlists/:id', [authMiddlevare], playlist_controller.adminPage_deletePlaylist_DELETE)

router.get('/playlists', playlist_controller.all_playlists_GET)

router.get('/playlists/:id', playlist_controller.adminPage_detail_playlist_GET)

router.get('/compositions', [authMiddlevare], music_controller.adminPage_listMusic_GET)

router.get('/compositions/:id', music_controller.adminPage_musicDetail_GET)

router.delete('/compositions/:id', [authMiddlevare], adminPage_controller.adminPAge_deleteUsersComposition_DELETE)

router.post('/compositions/update/:playlistId/:musicID', music_controller.adminPage_addComposition_inPlaylist_POST)

router.post('/myCompositions', [authMiddlevare], music_controller.adminPage_createMusic_POST) 

router.get('/myCompositions', [authMiddlevare], music_controller.adminPage_myCompositions_GET)

router.get('/myCompositions/:id', [authMiddlevare], music_controller.adminPage_MyMusicDetail_GET)

router.put('/myCompositions/:id', [authMiddlevare], music_controller.adminPage_MyMusic_UPDATE)

router.delete('/myCompositions', [authMiddlevare], music_controller.adminPage_deleteMyMusic_DELETE)

router.get('/janrs', janrs_controller.list_janrs)

router.get('/janrs/:id', janrs_controller.info_janr)

router.post('/janrs', janrs_controller.create_janr)

router.put('/janrs/:id', janrs_controller.update_janr)

router.delete('/janrs/:id', janrs_controller.delete_janr)

router.get('/roles', roles_controller.list_roles)

router.post('/roles', roles_controller.create_role)

router.get('/roles/:id', roles_controller.info_role)

router.put('/roles/:id/UpdateRights', roles_controller.update_role_delete_right)

router.put('/roles/:id', roles_controller.update_role)

router.delete('/roles/:id', roles_controller.delete_role)

router.get('/rights', rights_controller.list_rights)

module.exports = router;