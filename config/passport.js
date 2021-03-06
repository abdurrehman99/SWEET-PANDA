const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys')

const options = {} ;
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JWTStrategy(options, (JWT_payload ,done)=>{
        //console.log(JWT_payload);
        User.findById(JWT_payload.id)
        .then( (user)=> { 
            if(user){
                return done(null, user);
            }
            return done(null, false)
        })
        .catch(error=> {
            console.log(error);
        });
    }))
}