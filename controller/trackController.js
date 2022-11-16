var Janrs = require('../models/janrs');
var Albom = require('../models/albom');
var Tracks = require('../models/testTracks');
const fs = require('fs');
const path = require('path');
const async = require('async');
const validator = require('express-validator');
const {
    ValidationHalt
} = require('express-validator/src/base');
const {
    validationResult
} = require('express-validator');
var dir = "G:/Musik_app/musik_app/public/music";

//SHOW ALL TRACKS
exports.showAllTrack_GET = async function (req, res, next) {

    try {

        var getFiles = function (dir, files_) {

            files_ = files_ || [];
            var files = fs.readdirSync(dir);
            for (var i in files) {
                var name = dir + '/' + files[i];
                if (fs.statSync(name).isDirectory()) {
                    getFiles(name, files_)
                } else {
                    // var re = / /g;
                    var newName = name.replace(/\s/gi, '_')
                        fs.rename(name, newName, err => {
                            if(err) throw err
                            console.log('Успешно переименовано')
                        })
                    var files2 = name.split('/public')[1]
                    files_.push(files2);
                }
            }
            return files_;
        };
        console.log(getFiles(dir))
        res.render('ListMus', {
            title: 'Все треки',
            data: getFiles(dir),
        })
    }
    //console.log(getFiles(dir))
    catch (e) {
        return next(e)
    }


};

//LOAD ALL TRACKS FROM DIR
exports.loadMusFromDir_GET = function (req, res, next) {
    res.send({
        message: 'Пока что не реализовано LOAD ALL TRACKS FROM DIR'
    })
};

//Detail info abou mus :ID
exports.detailInfoMus_GET = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано Detail info about music :ID - ${req.body.id}`
    })
};

//Load NEW TRACK GET
exports.AddNewTrack_GET = function (req, res, next) {
    res.send({
        message: `Пока что не реализовано - Load NEW TRACK GET`
    });
};

//Load NEW TRACK POST
exports.AddNewTrack_POST = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Load NEW TRACK POST`
    })
};

//Edit track GET ID
exports.EditMus_GET = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Edit track GET ID`
    })
};

//Edit track POST ID
exports.EditMus_POST = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Edit track POST ID`
    })
};

//Delete mus GET ID
exports.DeleteMus_GET = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Delete mus GET ID`
    })
};

//Delete mus POST ID
exports.DeleteMus_POST = (req, res, next) => {
    res.send({
        message: `Пока что не реализовано - Delete mus POST ID`
    })
};