const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));
//Register Page
router.post('/login',(req, res, next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true
    })(req, res ,next);
} );
router.get('/register', (req, res) => res.render('register'));
//Register Handle
router.post('/register', (req, res) =>{
    const { name , email, password,password2} = req.body;
    let errors= [];
    //checking required fields
    if(!name || !email || !password || !password2)
    {
       errors.push({ msg:'Please fill in all fields'});    
    }
    //checking password matching
    if(password != password2){
        errors.push({ msg:'Passwords do not match'});
    }
    //checking password length
    if(password.length<6){
        errors.push({ msg:'Passwords must be at least of six digits'});
    }
     
    if(errors.length>0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        // after validation passed
        User.findOne({email:email})
        .then(user => {
            if(user)
            {// User exists
                errors.push({msg:'This email already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                
            }
            else
            {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //Hash or encrypt password
                newUser.save()
                    .then(user => 
                        {
                            req.flash('success-msg','You are now registered and can login');
                            res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
              /*  bcrypt.getSalt(10, (err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    // set password to hashed
                    newUser.password = hash;
                    newUser.save()
                    .then(user => 
                        {res.redirect('/login');
                    })
                    .catch(err=>console.log(err))
                }));*/
            }
        });
    }
});

module.exports = router;
