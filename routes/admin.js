const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Orders');
const Bakers = require('../models/Bakers');
const BakerItems = require('../models/BakeryItems');

//GET all Orders from DB
router.get('/getAllOrders',(req,res)=>{
    Order.find({})
    .then( data => {
        res.status(200).send(data);
    });
});

//GET all Users from DB
router.get('/getAllUsers',(req,res)=>{
    User.find({})
    .then( data => {
        res.status(200).send(data);
    });
});

//POST delete User
router.post('/deleteUser/:email',(req,res)=>{
    let email = req.params.email;
    User.findOneAndDelete({ email } ,(err)=>{
        if(err) return res.status(400).json({ err });
        else return res.status(200).json({"msg" : "User Deleted !"});
    });
});

//POST edit User
router.post('/editUser',(req,res)=>{
    const { _id , fullName, email , mobileNo } = req.body;
    User.findOneAndUpdate({ _id },{ fullName, email , mobileNo }, { new: true,useFindAndModify: false }, (err,doc)=>{
        if(err) return res.status(400).json({ err });
        else {
            console.log(doc);
            return res.status(200).json(doc);
        }
    });
})

//GET all Vendors from DB
router.get('/getAllVendors',(req,res)=>{
    Bakers.find({})
    .then( data => {
        res.status(200).send(data);
    });
})

//POST Vendor
router.post('/uploadVendor',(req,res)=>{
    let imgURL = req.file.buffer.toString("base64");
    let name = req.body.name;
    console.log(req.file);
    console.log(req.body.name);

    Bakers.findOne({ name })
    .then( baker=>{
        if(baker){
            res.sendStatus(400).json({ error : 'Vendor already exist !' })
        }
        else{
            const newVendor = new Bakers({
                name ,
                imgURL
            });
            newVendor.save()
            .then( vendor =>{
                res.sendStatus(200).json({ msg : "Vendor Added !" })                
            })
            .catch( err => {
                console.log(err);
            })
        }
    })
     
})

//POST delete Vendor
router.post('/deleteVendor/:id',(req,res)=>{
    let id  = req.params.id;
    console.log(id);
    Bakers.findOneAndDelete({ _id : id } ,(err)=>{
        if(err) return res.status(400).json(err);
        else return res.status(200).json({"msg" : "Vendor Deleted !"});
    });
});

//GET all Product : Category
router.get('/getAllProducts/:category',(req,res)=>{
    let { category } = req.params;
    console.log(req.params);
    BakerItems.find({ category })
    .then( data=>{
        res.send(data).status(200);
    })
    .catch( err=>{
        res.send(400).status(400)
        console.log(err);
    });
});

//POST Delete product
router.post('/deleteProduct',(req,res)=>{
    let { _id } = req.body;
    console.log(_id);
    BakerItems.findOneAndDelete({ _id }, (err)=>{
        if(err) return res.status(400).json(err);
        else return res.status(200).json({"msg" : "Product Deleted !"});
    })
})

//POST Edit product
router.post('/editProduct',(req,res)=>{
    let { _id ,name , price ,category } = req.body;
    console.log(req.body);
    BakerItems.findOneAndUpdate({ _id },{ name , price , category  }, { new: true,useFindAndModify: false }, (err,doc)=>{
        if(err) {
            console.log(err);
            return res.status(400).json(err);
        }
        else {
            return res.status(200).json(doc);
        }
    });

})

//POST Add new Product
router.post('/uploadProduct',(req,res)=>{
    
    let imgURL = req.file.buffer.toString("base64");
    let name = req.body.name;
    let category = req.body.category;
    let price = req.body.price;
    console.log(req.file);
    console.log(req.body.name, req.body.category);

    BakerItems.findOne({ name })
    .then( item=>{
        if(item){
            res.sendStatus(400).json({ error : 'Product already exist !' })
        }
        else{
            const newItem = new BakerItems({
                name ,
                category,
                price,
                imgURL
            });
            newItem.save()
            .then( item =>{
                res.status(200).json({ msg : "Product Added !" })                
            })
            .catch( err => {
                console.log(err);
            })
        }
    })
     
})

module.exports = router;