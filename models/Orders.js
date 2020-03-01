const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Orders Schema
const Orders = new Schema ({
    user : {
        type : Object,
        required : true
    },
    cart : {
        type : Array,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    totalAmount : {
        type : Number,
        required : true
    },
    paymentMethod : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('orders', Orders);