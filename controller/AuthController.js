const express = require('express');
const router = express('router');
const LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./scratch');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

var user = require('../model/User');

router.use(express.urlencoded({extended:true}));
router.use(express.json());


//Registration
router.post('/register', (req,res)=>{
    let userInfo = req.body;
    const hashedPassword = bcrypt.hashSync(userInfo.password, 8);

    user.create({
        name: userInfo.name,
        email: userInfo.email,
        password: hashedPassword,
        admin: userInfo.admin?userInfo.admin:false
    },(err, user)=>{
        if (err){
            return res.status(500).send("There was problem registering the user.");
        }else{
            let token = jwt.sign(
                {id:user._id},
                config.secret,
                {
                    expiresIn: 900 // 15 minute
                }
            );
            const string = encodeURIComponent("Successfully Registered. Please Log in.");
            res.redirect('/login');
        }
    })
})

//Login 
router.post('/loginVerify', (req,res)=>{
    let userInfo = req.body;
    user.findOne(
        {
            email: userInfo.email
        },
        (err, user)=>{
            if(err){
                return res.status(500).send('Error on the server.');
            }else{
                const string = encodeURIComponent('! Please enter valid value');
                if (!user) { 
                    res.redirect('/?valid=' + string);
                }else{
                    const passwordIsValid = bcrypt.compareSync(userInfo.password, user.password);
                    if(!passwordIsValid){
                        return res.status(401).send({
                            auth:false,
                            token:null
                        })
                    }else{
                        let token = jwt.sign({
                            id: user._id
                        },config.secret,{
                            expiresIn: 900 //15 minute
                        });

                        localStorage.setItem('authtoken', token);
                        console.log(localStorage.getItem('authtoken'));
                        console.log("Log in Verified!");
                        res.redirect('/');
                    }
                }
            }
        }
    )
})

router.get('/loggedInUser', (req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
    }else{
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err){
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }else{
                user.findById(decoded.id, {password: 0}, (err, user)=>{
                    if (err) return res.status(500).send("There was a problem finding the user.");
                    if (!user) return res.status(404).send("No user found.");
        
                    res.status(200).send(user);
                })
            }
        })
    }
})

module.exports = router;