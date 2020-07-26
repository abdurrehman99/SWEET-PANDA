const express = require('express');
const router = express.Router();
const Subscriber = require('../models/SubscribedUsers');
const nodemailer = require("nodemailer");


router.post('/subscribe',(req,res)=>{
    
    let subscriber = req.body.email;
    Subscriber.findOne({ email : req.body.email })
        .then( user=>{
            if(user){
                return res.status(400).json({ title : 'You are already subscribed !' });
            }
            else{

                const newUser = new Subscriber({
                    email : subscriber
                });

                //Save Info
                newUser.save()
                .then(user => console.log(user))
                .catch(err => console.log(err));

                
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
                    html: `<h2>Hi,</h2><h3>Your Email is Subscribed to Sweet Panda, Now you can get updates & promotions !</h3><p>If want to unsubscribe reply with text 'Unsubscribe me'.</p>` // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 
                });

                return res.status(200).json({ title : 'You are Subscribed to Sweet Panda !' });
                
                
            }
        });
        
    
})

module.exports = router;