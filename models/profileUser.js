var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var profileUserShema = new Schema({
    id_login_guest: {type: Schema.ObjectId, ref: 'User', required: true},
    FirstName: {type: String, minlength: [2, 'Слишком коротко'], maxlength: [12, 'Слишком длинное имя'], required: false, trim: true},
    MidName: {type: String, minlength: [5, 'Слишком коротко'], maxlength: [20, 'Слишком длинное отчество'], required: false, trim: true},
    LastName: {type: String, minlength: [2, 'Слишком коротко'], maxlength: [25, 'Слишком длинная фамилия'], required: false, trim: true},
    AboutUser: {type: String, required: false}
})

//profileuserShema

module.exports = mongoose.model('UserProfile', profileUserShema);