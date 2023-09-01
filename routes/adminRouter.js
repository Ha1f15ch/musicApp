var express = require('express');
var router = express.Router();

const rights_controller = require('../controllers/rights.controller'); 
const roles_controller = require('../controllers/roles.controller.js');
const janrs_controller = require('../controllers/janrs.controller');
const users_controller = require('../controllers/users.controller');
const adminPage_controller = require('../controllers/adminPage.controller');

var authMiddlevare = require('../middleware/authMiddleware')
var CheckUsersProperties = require('../middleware/propertiesMiddleware')

router.get('/', (req, res, next) => {
    res.send({message: 'directorys'})
})

router.get('/users', users_controller.list_users)

router.get('/users/:id', [authMiddlevare], users_controller.info_user)

router.get('/users/update/:id', users_controller.updateUser_get)//переделать как положено, update наружу запроса, id внутрь

router.put('/users/update/:id', users_controller.updateUser_put)// аналогично верхенму

router.get('/users/:id/playlists/', (req, res, next) => {
    res.send('2й состав запроса, 2а параметра в поиске')
})

router.get('users/:id/playlists/:id', (req, res, next) => {
    res.send('2а параметра в строке, данные по определенному плэйлисту')
})

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