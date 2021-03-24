const express = require('express');
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const bcrypt = require('bcryptjs');
const config = require('../config.js');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded({extended:true}));
router.use(express.json());

const user = require('../model/User');
const shopping = require('../model/Shopping');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));

router.get('/postItem', (req,res)=>{
    var token = localStorage.getItem('authtoken');
    if(!token){
        res.redirect('/login');
    }else{
        jwt.verify(token, config.secret, (err,decoded)=>{
            if(err){
                res.redirect('/login');
            }else{
                user.findById(decoded.id, {password: 0}, (err,currUser)=>{
                    if(err){
                        res.redirect('/login');
                    }else if(!currUser){
                        res.redirect('/login');
                    }else if(currUser.admin == false){
                        res.redirect('/');
                    }else{
                        res.render('postItem',{
                            user:currUser
                        })
                    }
                })
            }
        })
    }
})

router.get('/addUser', (req,res)=>{
    var token = localStorage.getItem('authtoken');
    if(!token){
        res.redirect('/login');
    }else{
        jwt.verify(token, config.secret, (err,decoded)=>{
            if(err){
                res.redirect('/login');
            }else{
                user.findById(decoded.id, {password: 0}, (err,currUser)=>{
                    if(err){
                        res.redirect('/login');
                    }else if(!currUser){
                        res.redirect('/login');
                    }else if(currUser.admin == false){
                        res.redirect('/');
                    }else{
                        res.render('addUser',{
                            user:currUser
                        })
                    }
                })
            }
        })
    }
})

router.post('/api/user', (req,res)=>{
    let userInfo = req.body;
    const hashedPassword = bcrypt.hashSync(userInfo.password, 8);

    user.create({
        name: userInfo.name,
        email: userInfo.email,
        password: hashedPassword,
        admin: userInfo.admin === "true" ? true:false
    },(err, user)=>{
        if (err){
            return res.status(500).send("There was problem adding the user.");
        }else{
            
            res.redirect('/');
        }
    })
})

router.post('/api/item', (req,res)=>{
    let orderInfo = req.body;
    shopping.create({
        name: orderInfo.name,
        seller: orderInfo.seller,
        price: orderInfo.price,
    },(err, item)=>{
        if(err){
            return res.status(500).send("There was problem adding product.");
        }else{
            res.redirect('/');
        }
    })
})


router.get('/userList', (req,res)=>{
    var token = localStorage.getItem('authtoken');
    if(!token){
        res.redirect('/login');
    }else{
        jwt.verify(token, config.secret, (err,decoded)=>{
            if(err){
                res.redirect('/login');
            }else{
                user.findById(decoded.id, {password: 0}, (err,currUser)=>{
                    if(err){
                        res.redirect('/login');
                    }else if(!currUser){
                        res.redirect('/login');
                    }else if(currUser.admin == false){
                        res.redirect('/');
                    }else{
                        user.find({},(err,data)=>{
                            if(err){
                                res.status(500).send(err)
                            }else{
                                res.render('userList',{
                                    user:currUser,
                                    userList: data
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})

router.get('/', (req,res)=>{
    var token = localStorage.getItem('authtoken');
    console.log("token: ", token);
    if(!token){
        res.redirect('/login');
    }else{
        jwt.verify(token, config.secret, (err,decoded)=>{
            console.log("decoded: ", decoded);
            if(err){
                res.redirect('/login');
            }else{
                user.findById(decoded.id, {password: 0}, (err, user)=>{
                    if(err){
                        res.redirect('/login');
                    }else if(!user){
                        res.redirect('/login');
                    }else{
                        console.log("user : ", user);
                        shopping.find({},(err,data)=>{
                            if(err){
                                res.redirect('/login');
                            }else{
                                res.render('dashboard', {
                                    user, shoppingList:data
                                })
                            }
                        })  
                    }
                })
            }
        })
    }
})

router.get('/logout', (req,res)=>{
    localStorage.removeItem('authtoken');
    res.redirect('/login');
})

module.exports = router;