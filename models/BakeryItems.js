const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Bakers Schema
const BakerItems = new Schema ({
    name : {
        type : String,
        required : true
    },

    category : {
        type : String,
        required : true
    },

    price : { 
        type : Number,
        required : true
    },
    
    imgURL : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('bakeryitems', BakerItems);