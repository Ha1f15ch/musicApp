var express = require('express');
var router = express.Router();

const rights_controller = require('../controllers/rights.controller'); 
const roles_controller = require('../controllers/roles.controller.js');

router.get('/', (req, res, next) => {
    res.send({message: 'directorys'})
})

router.get('/users', (req, res, next) => {
    res.send({message: 'users info'})
})

router.get('/users/:id', (req, res, next) => {
    res.send({message: 'info about once user'})
})

router.get('/janrs', (req, res, next) => {
    res.send({message: 'list janrs'})
})

router.get('/janrs/:id', (req, res, next) => {
    res.send({message: 'list info about once janr'})
})

router.get('/roles', roles_controller.list_roles)

router.post('/roles', roles_controller.create_role)

router.get('/roles/:id', roles_controller.info_Role)

router.put('/roles/:id', roles_controller.update_role)

router.delete('/roles/:id', roles_controller.delete_role)

router.get('/rights', rights_controller.list_rights)

module.exports = router;