var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ShoppingSchema = new Schema({
    name: {type:String},
    seller: {type:String},
    price: {type:String},
},{
    timestamps:true
},{
    collection:"shoppings"
});

module.exports = mongoose.model('shopping', ShoppingSchema);