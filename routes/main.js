var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/v1/api/main')
})

router.get('/v1/api/main', (req, res, next) => {
    res.send({message: 'messagedata'})
})

router.get('/v1/api/main/track/:id', (req, res, next) => {
    res.send({message: `page composition ${id}`})
})

router.get('/v1/api/main/janrs', (req, res, next) => {
    res.send({message: 'page with janrs, list with janrs'})
})

router.get('/v1/api/main/janrs/janr/:id', (req, res, next) => {
    res.send({message: `info about janr, list with composition, where this janr (${id}) is included`})
})

router.get('/v1/api/main/users/', (req, res, next) => {
    res.send({message: 'list with all users, may be them statuses'})
})

router.get('/v1/api/main/users/user/:id', (req, res, next) => {
    res.send({message: `publick info about other user ${id}`})
})

router.get('/v1/api/myProfile', (req, res, next) => {
    res.send({message: 'myPage'})
})

router.get('/v1/api/myProfile/myPlaylists', (req, res, next) => {
    res.send({message: 'myplaylists'})
})

module.exports = router;