var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var profileUserShema = new Schema({
    id_login_guest: {type: Schema.ObjectId, ref: 'Guest', required: true},
    FirstName: {type: String, minlength: [2, 'Слишком короко'], maxlength: [12, 'Слишком длинное имя'], required: false, trim: true},
    MidName: {type: String, minlength: [5, 'Слишком короко'], maxlength: [20, 'Слишком длинное отчество'], required: false, trim: true},
    LastName: {type: String, minlength: [2, 'Слишком короко'], maxlength: [25, 'Слишком длинная фамилия'], required: false, trim: true},
    AgeUser: {type: Date, required: false},
    AboutUser: {type: String, required: false}
})

//profileuserShema

module.exports = mongoose.model('UserProfile', profileUserShema);