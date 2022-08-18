var fs = require('fs')
var dir = 'D:/music/для всего остального/';
var path = require('path')
//var files = fs.readFileSync(dir)
var TestMusiList = require('../models/testTracks')

exports.AllMusik_GET = function(req, res, next) {

    fs.readdir(dir, (err, files) => {

        if(err) {
            return err
        } 
        files.forEach(file => {

            console.log(file)
        })
        res.render('ListMus', {title: 'Все треки', data: files})
    })
}