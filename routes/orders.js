const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const stripe = require('stripe')('sk_test_l1bAw4ZYCu9o5ZGChKYaQBaQ00h9cVfYqj');
const Order = require('../models/Orders');

router.post('/orders',(req,res)=>{
    
    const newOrder = Order({
        user : req.body.user,
        cart : req.body.mycart,
        address : req.body.address,
        totalAmount : req.body.totalAmount,
        paymentMethod : req.body.paymentMethod,
    });
    
    //Save Order
    newOrder.save()
        .then( order=> { 
            console.log(order);
            return res.status(200).json({ title : "Your Order has been placed !" })
        })
        .catch( err=> {
            console.log(err);
            return res.status(400).json({ title : "Something went wrong" });
        });
});

router.post('/stripe',async (req, res) => {
    let error;
    let status;
    try {
      const { product, token } = req.body;
  
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      const idempotency_key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: product.price,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip
            }
          }
        },
        {
          idempotency_key
        }
      );
      console.log("Charge:", { charge });
      status = "success";
    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }
    res.json({ error, status });
});

module.exports = router;