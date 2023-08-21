const async = require('async');
var Janrs = require('../models/janrs.model')

exports.list_janrs = async (req, res, next) => {
    await Janrs.find({})
    .then((results) => {
        console.log(results)
        res.status(200).send(results)
    })
    .catch((errors) => {
        console.log(errors)
        return next(errors)
    })
};

exports.info_janr = async (req, res, next) => {
    await Janrs.find({})
    .then((results) => {
        console.log(results)
        res.status(200).send(results)
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
    var updatedJanr = new Janrs({
        name: req.body.name,
        descriptions: req.body.descriptions
    })

    await Janrs.findByIdAndUpdate(req.params.id, updatedJanr, {})
    .then((results) => {
        console.log(results)
        res.redirect(results.janrId)
    })
    .catch((errs) => {
        console.log(errs)
        return next(errs)
    })
};

exports.delete_janr = async (req, res, next) => {
    await Janrs.findById(req.params.id)
    .then((findedJanr) => {
        Janrs.findByIdAndDelete(findedJanr._id)
        .then((deletedJanr) => {
            console.log(deletedJanr)
            res.redirect('/v1/api/adminCatalog/janrs')
        })
        .catch((errs) => {
            console.log(errs)
            return next(errs)
        })
    })
    .catch((errs) => {
        console.log(errs)
        return next(errs)
    })
};