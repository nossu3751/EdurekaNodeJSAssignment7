var mongoose = require("mongoose");
var connection = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/assignment7',{
    useUnifiedTopology:true,
    useNewUrlParser:true
});

connection.once('open',()=>{
    console.log("successfully connected to database!");
})