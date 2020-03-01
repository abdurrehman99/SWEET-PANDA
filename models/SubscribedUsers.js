const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create User Schema
const SubscribedUser = new Schema ({
    email : { 
        type : String,
        required : true
    },
});

module.exports = mongoose.model('SubscribedUser', SubscribedUser);