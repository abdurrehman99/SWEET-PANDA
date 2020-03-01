const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const multer = require('multer');
const path = require('path');

//Init app
const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//Multer Middleware
app.use(multer().single('image'));

//DB config
const dbURL = require('./config/keys').mongoURL;

//Connect to Mongo DB
mongoose
    .connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB is connected !'))
    .catch( error => console.log(error));
    
//Index Routes
// app.get('/',(req,res)=> {
//     res.sendFile('index.html');
// })

//User API routes
const users = require('./routes/api/users');

//Admin API routes
const admin = require('./routes/admin');

//Bakery API routes
const bakery = require('./routes/bakers');

//Subscriber route
const subscribe = require('./routes/subscriber');

//Orders route
const orders = require('./routes/orders');

//Passport middleware
app.use(passport.initialize());

//Password config
require('./config/passport')(passport);

//User Routes
app.use('/api/users', users);

//Bakery Routes
app.use('/api',bakery);

//Admin Routes
app.use('/api',admin);

//Subscriber Route
app.use('/api',subscribe);

//Orders Route
app.use('/api',orders);

//setting default port for NODE app
const PORT = process.env.PORT || 5000;

//Server static assets in production
if(process.env.NODE_ENV === 'production'){
    
    //Set static folder
    app.use(express.static('client/build'));

    app.get('/',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','static','index.html'));
    });
}


app.listen(PORT, () => console.log(`Server running on port ${PORT} !`));