const express = require("express");
const app = express();
const db = require('./db/db');
const LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port = process.env.PORT || 8004;

const session = require('express-session');
app.use(session({
    secret: 'edurekaSecret',
    resave: false,
    saveUninitialized:false
}));

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.set('views', './views');

const AuthController = require('./controller/AuthController');
app.use('/auth', AuthController);

const UserController = require('./controller/UserController');
app.use('/', UserController);

// app.get('/', (req,res)=>{
//     res.render('dashboard',{})
// })

app.get('/login', (req,res) => {
    let user = localStorage.getItem('authtoken');
    if(user == null || user === undefined){
        res.render('login',{})
    }else{
        res.redirect('/');
    }
    
})

app.get('/signup', (req,res) => {
    let user = localStorage.getItem('authtoken');
    if(user == null || user === undefined){
        res.render('signup',{})
    }else{
        res.redirect('/');
    }
    
})

app.listen(port, ()=>{
    console.log("Server started!");
})