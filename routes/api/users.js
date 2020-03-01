const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const nodemailer = require("nodemailer");

//Load validations
const validateRegister = require('../../validation/register');
const validateLogin = require('../../validation/login');

//Load User Model
const User = require('../../models/User');
 

//@route POST api/users/register
//@desc Register User
//@access Public 

router.post('/register', (req,res)=> {

    const { errors, isValid } = validateRegister(req.body) 

    //Chk Errors
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Chk if email already exist
    User.findOne({ email: req.body.email })
    .then( user=> {
        if(user){
            errors.email = 'Email already exists !';
            return res.status(400).json(errors);
        }
        else {
            const newUser = new User({
                fullName : req.body.fullName,
                email : req.body.email,
                password : req.body.password,
                mobileNo : req.body.mobileNo,
            });
            
            bcrypt.genSalt(5, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) {
                        throw err;
                    }
                    newUser.password = hash;

                    //Save user info
                    newUser.save()
                        .then(user => {res.json(user);console.log(user)})
                        .catch(err => console.log(err));
                    });
                });
                // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: 'sweet.panda.mailer@gmail.com', // generated ethereal user
                            pass: 'axguru12345'  // generated ethereal password
                        },
                        tls:{
                            rejectUnauthorized:true
                        }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Sweet Panda"', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'Welcome to Sweet Panda', // Subject line
                        text: '', // plain text body
                        html: `<h2>Hello,</h2><h3>${req.body.fullName} you have successfully signed up for Sweet Panda !</h3>` // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);   
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 
                    });
        }
    });
});

// @route POST api/user/login
// @desc Login User / Returning JWT
// @access Public

router.post('/login', (req,res)=> {

    const {errors,isValid} = validateLogin(req.body);
    //Chk validation
    if(!isValid){
        return res.status(400).json(errors);
    }
     const email = req.body.email;
     const password = req.body.password;

     //Find User by email
     User.findOne({ email })
        .then( user => {
            //Chk for user
            if(!user){
                errors.email = 'Email not found !';
                return res.status(400).json(errors);
            }

            //Chk password
            bcrypt.compare(password,user.password) 
                .then( (isMatch)=>{
                    if(isMatch){
                        //User Matched
                        //Create JWT payload
                        const payload = { id: user.id , fullName:user.fullName, email : user.email }  

                        //Sign Token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn : 1800 }, (err, token)=>{

                            res.json({ Login : true , token : 'Bearer '+token ,email : user.email });

                        });
                    }
                    else{
                        errors.password = 'Password is Incorrect !';
                        return res.status(400).json(errors)
                    }
                })
    });

});

// @route GET api/user/current
// @desc Return current user
// @access Private

router.get('/current',passport.authenticate('jwt', { session : false }), (req,res)=>{
    res.json({ id : req.user.id , name : req.user.fullName})
})

module.exports = router;