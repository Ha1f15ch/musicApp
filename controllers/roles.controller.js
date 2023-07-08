var Roles = require('../models/roles.model.js')
var Rights = require('../models/rights.model')
const async = require('async');

exports.list_roles = async (req, res, next) => {
    try {

        await Roles.find({})
        .populate({path: 'values', model: Rights})
        .then((results) => {
            res.send(results)
        })
        .catch((error) => {
            console.log(error)
            return next(error)
        })

    } catch(e) {
        console.log(e)
        return next(e)
    }
};

exports.info_Role = async (req, res, next) => {
    try {

        await Roles.findById({
            _id: req.params.id
        })
        .populate({path: 'values', model: Rights})
        .then((results) => {
            res.send(results)
        })
        .catch((error) => {
            console.log(error)
            return next(error)
        })

        /* async.parallel({
            roles: function(callback) {
                Roles.findById(req.params.id)
                .populate({path: 'values', model: Rights})
                .then((roleRes) => {
                    console.log(roleRes)
                })
                .catch((roleErr) => {
                    console.log(roleErr)
                    return next(roleErr)
                })
            },
            rights: function(callback) {
                Rights.find({})
                .then((rightsRes) => {
                    console.log(rightsRes)
                })
                .catch((rightsErr) => {
                    console.log(rightsErr)
                    return next(rightsErr)
                })
            }
        }, (results) => {
            for(let i = 0; i < results.rights.length; i++) {
                if(updatedRole.values.indexOf(results.rights[i]._id) > -1) {
                    results.rights[i].checked = "true"
                }
            }
            
            
        }) */

    } catch(e) {
        console.log(e)
        return next(e)
    }
}

exports.create_role = [
    async (req, res, next) => {

        var newRole = new Roles({
            name: req.body.name,
            values: req.body.dataRights
        })

        findRole = await Roles.findOne({
            name: req.body.name
        })
        .then((results) => {
            if(results) {
                res.send('Такое значение уже задано')
            } else {
                newRole.save()
                .then((resCreated) => {
                    console.log(newRole)
                    res.redirect('/v1/api/adminCatalog/roles')
                })
                .catch((errorCreated) => {
                    console.log(errorCreated);
                })
            }
        })
        .catch((errors) => {
            console.log(errors);
            return next(errors)
        })
    }
];

exports.update_role = (req, res, next) => {

    var updatedRole = new Roles({
        name: req.body.name,
        values: req.body.dataRights,
        _id: req.params.id
    });

    console.log(updatedRole, 'updatedRole')
    console.log(req.params.id, 'ID roles')

    Roles.findByIdAndUpdate(req.params.id, updatedRole, {})
    .then((result) => {
        console.log(result, 'results - -')
        res.redirect('/v1/api/adminCatalog/roles')
    })
    .catch((errs) => {
        console.log(errs, 'Errors message')
        return next(errs)
    })
};

exports.delete_role = async (req, res, next) => {
    await Roles.findById(req.params.id)
    .then((result) => {
        Roles.findByIdAndDelete(req.params.id)
        .then((resDeleted) => {
            console.log(`Удален элемент с id = ${req.params.id}, name = ${resDeleted.name}`)
            res.redirect('/v1/api/adminCatalog/roles')
        })
        .catch((errDeleted) => {
            console.log(errDeleted)
            return next(errDeleted)
        })
    })
    .catch((error) => {
        console.log(error);
        return next(error);
    })
}