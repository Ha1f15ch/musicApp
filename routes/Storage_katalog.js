var express = require('express');
var router = express.Router();
var janrController = require('../controller/janrController')
var trackController = require('../controller/trackController')
var userController = require('../controller/userRole.controller')
var authJWT = require('../middleware/authMidleware')
const roleMidleware = require('../middleware/roleMidleware')
const {check} = require('express-validator');

//show catalog
router.get('/', function(req, res) {
    res.redirect('admin_mod/catalog')
})
router.get('/catalog', function(req, res, next) {
    res.render('adminPage', {title: 'АдминПанель'})
});

//show janrs
router.get('/catalog/janrs', janrController.showJanr_GET);

//show detal info about janr
router.get('/catalog/janrs/:id', janrController.janrDetaled_GET)

//add new janr
router.get('/catalog/janr/addNew', janrController.addJanr_GET);
router.post('/catalog/janr/addNew', janrController.addJanr_POST);

//update janr
router.get('/catalog/janrs/:id/update', janrController.editJanr_GET);
router.post('/catalog/janrs/:id/update', janrController.editJanr_POST);

//delete janr
router.get('/catalog/janrs/:id/delete', janrController.deleteJanr_GET);
router.post('/catalog/janrs/:id/delete', janrController.deleteJanr_POST);

//show musick lost ALL data
router.get('/catalog/tracks', trackController.showAllTrack_GET); // тестовый эндпоинт, проверяется способ преобразования файловых названий понужной форме

//load ALL DATA TRACKS
router.get('/catalog/tracks/allNotes', trackController.allTrack_GET);

//Add new track (only one, by user 'for exemple')
router.get('/catalog/tracks/addNew', trackController.AddNewTrack_GET)
router.post('/catalog/tracks/addNew', trackController.AddNewTrack_POST)

//Detal info aboit mus
router.get('/catalog/tracks/:id', trackController.detailInfoMus_GET);

//Edit track
router.get('/catalog/tracks/:id/update', trackController.EditMus_GET)
router.post('/catalog/tracks/:id/update', trackController.EditMus_POST)

//Delete mus
router.get('/catalog/tracks/:id/delete', trackController.DeleteMus_GET)
router.post('/catalog/tracks/:id/delete', trackController.DeleteMus_POST)

//Add track in playlist
router.post('/catalog/tracks/allNotes', trackController.playlistHAStrack_POST)

//UserRols storage - СПРАВОЧНИК
router.get('/catalog/rols', userController.allRols_GET)

//add userRols item
router.get('/catalog/rols/add', userController.createRole_GET)
router.post('/catalog/rols/add', userController.createRole_POST)

//InfoRoles
router.get('/catalog/rols/:id', userController.infoRole_GET)

//edit UserRols item
router.get('/catalog/rols/:id/edit', userController.editRole_GET)
router.post('/catalog/rols/:id/edit', userController.editRole_POST)

//delete UserRole item
router.get('/catalog/rols/:id/delete', userController.deleteRole_GET)
router.post('/catalog/rols/:id/delete', userController.deleteRole_POST)

module.exports = router;