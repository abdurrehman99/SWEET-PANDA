const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Bakers Schema
const BakerSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    imgURL : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('bakers', BakerSchema);