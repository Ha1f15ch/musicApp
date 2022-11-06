var express = require('express');
var router = express.Router();
var janrController = require('../controller/janrController')
var trackController = require('../controller/trackController')
const authMidleware = require('../middleware/authMidleware')
const roleMidleware = require('../middleware/roleMidleware')
const {check} = require('express-validator');
const { showAllTrack_GET } = require('../controller/trackController');

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
router.get('/catalog/tracks', trackController.showAllTrack_GET)

//load ALL DATA TRACKS
router.get('/catalog/tracks/loadByDir', trackController.loadMusFromDir_GET)

//Detal info aboit mus
router.get('/catalog/tracks/:id', trackController.detailInfoMus_GET)

//Add new track (only one, by user 'for exemple')
router.get('/catalog/tracks/addNew', trackController.AddNewTrack_GET)
router.post('/catalog/tracks/addNew', trackController.AddNewTrack_POST)

//Edit track
router.get('/catalog/tracks/:id/update', trackController.EditMus_GET)
router.post('/catalog/tracks/:id/update', trackController.EditMus_POST)

//Delete mus
router.get('/catalog/tracks/:id/delete', trackController.DeleteMus_GET)
router.post('/catalog/tracks/:id/delete', trackController.DeleteMus_POST)



module.exports = router;