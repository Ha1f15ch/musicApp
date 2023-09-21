const async = require('async');
var Janrs = require('../models/janrs.model')

exports.list_janrs = async (req, res, next) => {
    await Janrs.find({})
    .then((results) => {
        console.log(results)
        res.render('pageJanrs', {
            dataJanrs: results
        })
    })
    .catch((errors) => {
        console.log(errors)
        return next(errors)
    })
};

exports.info_janr = async (req, res, next) => {
    await Janrs.findById(req.params.id)
    .then((results) => {
        console.log(results)
        res.render('pageJanrInfo', {
            title: 'Информация о жанре',
            dataJanrItem: results
        })
    })
    .catch((errors) => {
        console.log(errors)
        return next(errors)
    })
};

exports.create_janr = [
    async (req, res, next) => {
        var newJanr = new Janrs({
            name: req.body.name,
            descriptions: req.body.descriptions
        });

        await Janrs.find({
            name: req.body.name
        })
        .then((foundedJanr) => {
            console.log(foundedJanr, 'foundedJanrs')
            if(foundedJanr.name == req.body.name) {
                console.log(foundedJanr)
                res.redirect(foundedJanr.janrId)
            } else {
                newJanr.save()
                .then((results) => {
                    console.log(results)
                    return res.status(200).redirect(results.janrId)
                })
                .catch((errors) => {
                    console.log(errors)
                    return next(errors)
                })
            }
        })
        .catch((foundedErr) => {
            console.log(foundedErr)
            return next(foundedErr)
        })
    }
];

exports.update_janr = async (req, res, next) => {

    try {
        var findedJanr = await Janrs.findById(req.params.id)
        var new_name = req.body.name

        var anotherDataJanr = await Janrs.find({
            name: new_name
        })
        var tempMass_idJanr = anotherDataJanr.map((el) => el._id+'')

        if(tempMass_idJanr.includes(req.params.id) || tempMass_idJanr.length == 0) {
            var updatedJanr = new Janrs({
                name: req.body.name,
                descriptions: req.body.descriptions,
                _id: req.params.id
            })
        
            await Janrs.findByIdAndUpdate(req.params.id, updatedJanr, {})
            .then((results) => {
                console.log(results, ' - Result Updated')
                res.sendStatus(200)
            })
            .catch((errs) => {
                console.log(errs)
                res.sendStatus(500)
            })
        } else {
            res.sendStatus(404)
        }
    } catch(e) {
        console.log('Ошбика - ', e)
    }
};

exports.delete_janr = async (req, res, next) => {
    await Janrs.findById(req.params.id)
    .then((findedJanr) => {
        Janrs.findByIdAndDelete(findedJanr._id)
        .then((deletedJanr) => {
            console.log(deletedJanr)
            res.sendStatus(200)
        })
        .catch((errs) => {
            console.log(errs)
            res.sendStatus(500)
        })
    })
    .catch((errs) => {
        console.log(errs)
        res.sendStatus(501)
    })
};