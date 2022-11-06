var Janrs = require('../models/janrs');
var Albom = require('../models/albom');
var Tracks = require('../models/testTracks');
const fs = require('fs');
const path = require('path');
const async = require('async');
const validator = require('express-validator');
const { ValidationHalt } = require('express-validator/src/base');
const { validationResult } = require('express-validator');
var dir = "D:/music";

//SHOW ALL TRACKS
exports.showAllTrack_GET = async function(req, res, next) {
    
    // fs.readdir(dir, (err, files) => {
    //     if(err) {
    //         return err
    //     } 
        
    //     files.forEach(file => {
    //         //console.log(file)
    //         console.log(path.resolve(file))
    //     }),
    //     res.render('ListMus', {title: 'Все треки', data: files})
    // })

    function givMeFiles(dirr, files){
    
        files = files || [];
          var allFiles = fs.readdirSync(dirr);
          for (var i =0; i<allFiles.length; i++){
              var name = dirr + '/' + allFiles[i];
              if (fs.statSync(name).isDirectory()){
                  givMeFiles (name, files);
                } else {
                    files.push(name);
                }
            }
            console.log(allFiles)
        return files;
    };
    res.render('ListMus', {title: 'Все треки', data: givMeFiles(dir)}, console.log(givMeFiles(dir)))
    //console.log(givMeFiles(dir))
    // givMeFiles(dir)
};

//LOAD ALL TRACKS FROM DIR
exports.loadMusFromDir_GET = function(req, res, next) {
    res.send({message: 'Пока что не реализовано LOAD ALL TRACKS FROM DIR'})
};

//Detail info abou mus :ID
exports.detailInfoMus_GET = (req, res, next) => {
    res.send({message: `Пока что не реализовано Detail info about music :ID - ${req.body.id}`})
};

//Load NEW TRACK GET
exports.AddNewTrack_GET = function(req, res, next) {
    res.send({message: `Пока что не реализовано - Load NEW TRACK GET`});
};

//Load NEW TRACK POST
exports.AddNewTrack_POST = (req, res, next) => {
    res.send({message: `Пока что не реализовано - Load NEW TRACK POST`})
};

//Edit track GET ID
exports.EditMus_GET = (req, res, next) => {
    res.send({message: `Пока что не реализовано - Edit track GET ID`})
};

//Edit track POST ID
exports.EditMus_POST = (req, res, next) => {
    res.send({message: `Пока что не реализовано - Edit track POST ID`})
};

//Delete mus GET ID
exports.DeleteMus_GET = (req, res, next) => {
    res.send({message: `Пока что не реализовано - Delete mus GET ID`})
};

//Delete mus POST ID
exports.DeleteMus_POST = (req, res, next) => {
    res.send({message: `Пока что не реализовано - Delete mus POST ID`})
};
