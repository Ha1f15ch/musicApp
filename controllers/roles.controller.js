var Roles = require('../models/roles.model.js')
var Rights = require('../models/rights.model')
const async = require('async');

exports.list_roles = async (req, res, next) => {
    try {
        async.parallel({
            dataRolesById: function(callback) {
                Roles.find({})
                .populate({path: 'values', model: Rights})
                .then((results) => {
                    callback(null, results)
                })
                .catch((error) => {
                    console.log('Ошибка при поиске по id - ', error)
                    callback(null, error)
                })
            },
            dataProp: function(callback) {
                Rights.find({})
                .then((results) => {
                    callback(null, results)
                })
                .catch((error) => {
                    console.log('Ошибкапоиска прав - ', error)
                    callback(null, error)
                })
            }
        }, (err, results) => {
            if(err) {
                console.log(err, ' - Возникла ошибка')
            }
            if(results) {
                res.render('pageRoles', {
                    title: 'Список ролей',
                    dataRoles: results
                })
            }
        })
    } catch(e) {
        console.log(e)
        return next(e)
    }
};

exports.info_role = async (req, res, next) => {
    try {

        async.parallel({
            dataRolesById: function(callback) {
                Roles.findById({
                    _id: req.params.id
                })
                .populate({path: 'values', model: Rights})
                .then((results) => {
                    callback(null, results)
                })
                .catch((error) => {
                    console.log('Ошибка при поиске по id - ', error)
                    callback(null, error)
                })
            },
            dataProp: function(callback) {
                Rights.find({})
                .then((results) => {
                    callback(null, results)
                })
                .catch((error) => {
                    console.log('Ошибкапоиска прав - ', error)
                    callback(null, error)
                })
            }
        }, (err, results) => {
            if(err) {
                console.log(err)
                return next(err)
            }
            res.render('pageRolesInfo', {
                title: 'Подробнее о роли',
                dataRoles: results
            })
        })
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

exports.update_role = async (req, res, next) => {

    findRole = Roles.findById(req.params.id)
    .populate({
        path: 'values',
        model: Rights
    })
    .then(async (foundedRole) => {
        console.log(foundedRole.values, ' - foundedRole')
        let tempArray = []
        for(let i = 0; i < foundedRole.values.length; i++) {
            tempArray.push(foundedRole.values[i]._id+'')
        }
        console.log(tempArray, ' - Временный массив')
        if(tempArray.includes(req.body.dataRight)) {
            console.log('Такое право уже есть в данной роли, выберите другое')
            res.sendStatus(401)
        } else {
            console.log(req.body.dataRight, ' - Даныне, которые добавляем')
            foundedRole.values.push(req.body.dataRight)
            console.log(foundedRole.values, 'Итоговые данные')
            var updatedRole = new Roles({
                name: foundedRole.name,
                values: foundedRole.values,
                _id: req.params.id
            });
            console.log(updatedRole, ' - Новые данные')

            await Roles.findByIdAndUpdate(req.params.id, updatedRole, {})
            .then((result) => {
                console.log(result, 'results - -')
                res.sendStatus(200)
            })
            .catch((errs) => {
                console.log(errs, 'Errors message')
                return next(errs)
            })
        }
    })
};

exports.update_role_delete_right = async (req, res, next) => {
    /* console.log(req, ' - айди') */
    console.log(req.params.id, ' - params')
    findRole = Roles.findById(req.params.id)
    .populate({path: 'values', model: Rights})
    .then(async (resFounded) => {
        console.log(resFounded, ' - resFounded')
        for(let i = 0; i < resFounded.values.length; i++) {
            if(resFounded.values[i]._id == req.body.deletedRight) {
                let newMassWithRights = resFounded.values.filter(value => value._id != req.body.deletedRight)
                console.log(newMassWithRights, ' - все id прав в роли, те что остались')
                var UpdatedRoleWithRight = new Roles({
                    name: resFounded.name,
                    values: newMassWithRights,
                    _id: req.params.id
                })
                await Roles.findByIdAndUpdate(req.params.id, UpdatedRoleWithRight, {})
                .then((resUpdated) => {
                    console.log('Успешно обновлено - ', resUpdated)
                    res.sendStatus(200)
                })
                .catch((errUpdated) => {
                    console.log('Апдейт не удался - ', errUpdated)
                    return next(errUpdated)
                })
                break
            } else {
                console.log('Данные не совпадают, ничего не найдено - ', resFounded.values[i]._id, ' - ', req.body.deletedRight)
            }
            /* res.redirect(resFounded.uri) */
        }
        console.log('767778')
    })
    .catch((errFounded) => {
        console.log('Ничего не найдено - ', errFounded)
        return next(errFounded)
    })
}

exports.delete_role = async (req, res, next) => {
    await Roles.findById(req.params.id)
    .then((result) => {
        Roles.findByIdAndDelete(req.params.id)
        .then((resDeleted) => {
            console.log(`Удален элемент с id = ${req.params.id}, name = ${resDeleted.name}`)
            res.sendStatus(200)/* redirect('/v1/api/adminCatalog/roles') */
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