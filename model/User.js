var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {type:String},
    email: {type:String},
    password: {type:String},
    admin: {type:Boolean, default:false}
},{
    collection:"users"
});

module.exports = mongoose.model('user', UserSchema);