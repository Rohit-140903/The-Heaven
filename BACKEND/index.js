const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
 //const stripe = require('stripe')("sk_test_51PiWzHKIoQkhF1oCFukLdoqZmNl0B2s38Sow2kX2hd8L26LFXDSHSq2smMZrWZxeBddO9AarprSSEjJrt4A8KzGX00iOTCKWJN");
 const stripe=require('stripe')(process.env.STRIPE_SECRET);

const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors()); // is use to connect the frontend to backend

//Database connection with Mongodb
mongoose.connect("mongodb+srv://shawadharsh:shawadharsh14E-commerce@cluster0.si5qwdm.mongodb.net/e-commerce");

//API creation
// app.get("/",(req,res)=>{
//     res.send("Express app is running");
// })


//Image Storage Engine 
// act as a middleware
const storage = multer.diskStorage(
    {
        destination:'./upload/images',
        filename : (req,file,cb)=>{
            return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        }
    }
)

const upload = multer({storage :storage})

//creating Upload Endpoint for images
app.use('/images',express.static('upload/images'));

app.post('/upload',upload.single('product'),(req,res)=>{ // yahan per upload.single(var_name) wahi use krna hai key mein***
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for creating Products
const Product = mongoose.model("Product",
    {
        id:{
            type : Number,
            required:true,
        },
        name : {
            type : String,
            required:true,
        },
        image:{
            type : String,
            required:true,
        },
        category : {
            type : String,
            required:true,
        },
        new_price:{
            type : Number,
            required:true,
        },
        old_price:{
            type : Number,
            required:true,
        },
        date : {
            type : Date,
            default : Date.now,
        },
        available:{
            type : Boolean,
            default : true,
        },
    }
);

//Creating api for adding the product onto the database
app.post('/addProduct', async(req,res)=>{
    //logic for not Providing the id in req
    let products = await Product.find({}) // returns all the Products
    let id;
    if(products.length > 0){
        let last_product_inArray = products.slice(-1); // return the lastProduct in the database
        let last_product = last_product_inArray[0];
        id = last_product.id + 1; 
    }else {
        id = 1;
    }
    const product = new Product({
        // id : req.body.id,
        id : id,
        name : req.body.name,
        image : req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    await product.save(); // saved in the database(Mongodb)
    console.log("Save");
    res.json({
        success:true,
        name : req.body.name,
    });
});

//creating api for removing the product from the database
app.post('/removeProduct',async(req,res) => {
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success:1,
        name : req.body.name,
    })
});

//creating api for getting all Products;
app.get('/allProducts',async(req,res) =>{
    const allProduct= await Product.find({});
    // console.log(allProduct);
    res.send(allProduct);
});

// Schema creation for user model

const User = mongoose.model('User',{
    name :{
        type :String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },cartData :{
        type:Object,
    },
    date : {
        type:Date,
        default:Date.now,
    }
});

//Creating end point for registering the user

app.post('/signup',async(req,res) =>{
    let check = await User.findOne({email:req.body.email});
    if(check){ // check === 1 means already existing
        return res.status(400).json({success:false,errors:"existing user found with same email address"});
    }
    let cart = {};
    for(let i = 0;i<300;i++){
        cart[i] = 0;
    }
    
    const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        cartData : cart,

    })
    await newUser.save();
    // console.log(newUser.id);
     
    // procedure for JWT authenication 

    const data = {
        user : {
            id : newUser.id // generated by mongodb
        }
    }

    const token = jwt.sign(data,'secret_ecom'); // salting
    res.json({success:true,token});

});

app.post('/login',async(req,res) =>{
    const user = await User.findOne({email:req.body.email});
    if(user){
        const passCompare = user.password === req.body.password;
        if(passCompare){
        const data = {
            user : {
                id : user.id
            }
        }
        const token = jwt.sign(data,'secret_ecom');
        res.json({success:true,token})
      }else{ // if pass was incorrect
        res.json({success:false,errors : "Wrong Password"});
      }
    }
    else{
        res.json({success:false,errros:"Sign In First!"});
    }
});

// creating endpoint for newcollection data

app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);// last 8 products will be added to new collection
    res.send(newcollection);
})

//creating endPoint for Popular in women data;

app.get('/popularinwomen',async(req,res) =>{
    let products = await Product.find({category:"women"});
    let popularInWomen = products.slice(0,4); // only 4 products 0 to 4
    res.send(popularInWomen);
});

//creating middleware to fetch user
const fetchUser = async(req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please Authenticaate using Valid token"})
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please Authenticaate using Valid token"});
        }
    }
}

//creating endpoint for adding products in cartdata

app.post('/addtocart',  fetchUser, async(req,res) =>{
    let userData = await User.findOne({_id : req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});

});

// creating endPoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res) =>{
    let userData = await User.findOne({_id : req.user.id});
    if(userData.cartData[req.body.itemId] > 0){
    userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    }
});

//creating endpoint to total the cart items when the user get logged in

app.post('/totalcartitems',fetchUser,async(req,res) =>{
    let userData = await User.findOne({_id : req.user.id});
    res.json(userData.cartData);
})

// creating end point for checkout-payment

app.post('/create-checkout-session',async(req,res) => {
    const products = req.body.products;
    const cartItems = req.body.quantity;
    const total_amount = req.body.total_amount;

    const validProducts = products.filter(item => cartItems[item.id] > 0);

    const items = validProducts.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
                // images: [item.image]  // because stripe doesn't access private url for that we have to use public clouds
            },
            unit_amount: Math.round(item.new_price*100),
        },
        quantity: cartItems[item.id]
    }));



    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:items,
        mode : "payment",
        success_url : "http://localhost:5173/success",
        cancel_url:"http://localhost:5173/failure"
    });

    res.json({id : session.id})



});

app.listen(port,(err)=>{
    if(!err) {
        console.log(`port is running at ${port}, http://localhost:${port}`);
    }else {
        console.log("error", err);
    }
    
})
