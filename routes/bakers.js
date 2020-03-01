const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/bakerslist',(req,res)=>{
    // res.status(200).send('List of bakers are here');
    User.find({})
    .then( data => {
        res.send(data);
    })
})

module.exports = router;