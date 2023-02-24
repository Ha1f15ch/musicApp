const async = require('async')
const validator = require('express-validator');
const Role = require('../models/role.model')

exports.allRols_GET = async function(req, res, next) {
    try {
        const roles = await Role.find()
        console.log(roles)
        res.render('roles', {
            title: "Системные роли",
            roles_list: roles
        });
    } catch (e) {
        console.log(e)
    }
}

exports.createRole_GET = async function(req, res, next) {
    try {
        const roles = await Role.find()
        console.log(roles)
        res.render('rolesAdd', {
            title: "Системные роли",
            roles_list: roles
        });
    } catch (e) {
        console.log(e)
    }
}

exports.createRole_POST = [

    validator.body('value', 'Название роли').isLength({min: 1, max: 30}),
    validator.sanitize('value').escape(),
    (req, res, next) => {

        const errors = validator.validationResult(req)

        var roleData = new Role({
            value: req.body.value
        });

        if(!errors.isEmpty()) {
            res.render('rolesAdd', {title: 'Добавление системной роли', roles_list: roleData, errors: errors.array()})
            return;
        } else {
            Role.findOne({
                'value': req.body.value
            })
            .exec(function(err, rolesFounded) {
                if(err) {
                    return next(err)
                }
                if(rolesFounded) {
                    res.redirect('/catalog/rols/'+rolesFounded._id)
                } else {
                    roleData.save(function(err) {
                        if(err) {
                            return next(err)
                        }
                        res.redirect('/admin_mod/catalog/rols')
                    })
                }
            })
        }
    }
]

exports.infoRole_GET = (req, res, next) => {
    res.send({message: 'Детальнеая инофрмация о роли'})
}

exports.editRole_GET = (req, res, next) => {
    res.send({message: 'Редактирование роли в системе'})
}

exports.editRole_POST = []

exports.deleteRole_GET = (req, res, next) => {
    res.send({message: 'Удаление роли из справочника'})
}

exports.deleteRole_POST = []