var express = require('express');
var router = express.Router();

const rights_controller = require('../controllers/rights.controller'); 
const roles_controller = require('../controllers/roles.controller.js');
const janrs_controller = require('../controllers/janrs.controller');
const users_controller = require('../controllers/users.controller');
const adminPage_controller = require('../controllers/adminPage.controller');
const playlist_controller = require('../controllers/playlist.controller');

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware')

router.get('/', adminPage_controller.mainPage_GET)

router.get('/myProfile', [authMiddlevare], adminPage_controller.MyProfile_GET)

router.put('/myProfile', [authMiddlevare], adminPage_controller.admin_UpdateMyAuth_PUT)

router.put('/myProfile/updateProfile', [authMiddlevare], adminPage_controller.MyProfile_PUT)

router.get('/myPlaylists/:id', [authMiddlevare], adminPage_controller.myPlaylistDetail_GET)

router.put('/myPlaylists/:id', [authMiddlevare, CheckUsersProperties.prop_editDicts], adminPage_controller.updatePlaylist_name_PUT)

//После добавится апдейт на добавление или удаление композиции из плэйлиста

router.delete('/myPlaylists/:id', [authMiddlevare], adminPage_controller.deletePlaylist_DELETE)

router.get('/myPlaylists', [authMiddlevare], adminPage_controller.list_myPlaylists_GET)

router.post('/myPlaylists', [authMiddlevare], adminPage_controller.createPlaylist_POST)

router.get('/users', users_controller.list_users)

router.get('/users/:id', [authMiddlevare], users_controller.info_user)

router.put('/users/:id/update', users_controller.updateUser_put)

router.put('/users/:id/updateProfile', users_controller.updateUser_profile_put)

router.put('/users/:id/updateRole', users_controller.updateUserRole_put)

router.put('/users/:id/deleteRole', users_controller.update_user_delete_role)

router.get('/users/:id/playlists/', playlist_controller.all_users_playlists_GET)

router.get('users/:idU/playlists/:idP', playlist_controller.detail_users_playlist_GET)

router.get('/playlists', playlist_controller.all_playlists_GET)

router.get('/playlists/:id', playlist_controller.detail_playlist_GET)

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