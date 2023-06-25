var express = require('express');
var router = express.Router();
var playlistController = require('../controller/playlists.controller')
const {authJWT} = require('../middleware')

//MyPLaylist show
router.get('/', [authJWT.verifytocen], playlistController.myPlaylists_GET)

//create new playsit GET
router.get('/add', [authJWT.verifytocen], playlistController.CreateMyPlaylist_GET)

// crate new playlist POST
router.post('/add', [authJWT.verifytocen], playlistController.CreateMyPlaylist_POST)

//Detail info about playlist
router.get('/:id', [authJWT.verifytocen], playlistController.detailInfoPlaylist_GET)

//edit myplaylist GET
router.get('/:id/edit', [authJWT.verifytocen], playlistController.editMyPlaylist_GET)

//edit myplaylist POST
router.post('/:id/edit', [authJWT.verifytocen], playlistController.editMyPlaylist_POST)

//delete myplaylist GET
router.get('/:id/delete', [authJWT.verifytocen], playlistController.deleteMyPlaylist_GET)

//delete myplaylist POST
router.post('/:id/delete', [authJWT.verifytocen], playlistController.deleteMyPlaylist_POST)

module.exports = router;