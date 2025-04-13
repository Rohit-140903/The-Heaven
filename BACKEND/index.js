// const dotenv = require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
// const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET);

// const port = process.env.PORT || 4000;

// const bodyparser = require("body-parser");

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// app.use(express.json());

// app.use(cors()); // is use to connect the frontend to backend

// const uri = `mongodb+srv://shawadharsh:${process.env.DATABASE_SECRET}-commerce@cluster0.si5qwdm.mongodb.net/e-commerce`;

// //Database connection with Mongodb
// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((error) => {
//     console.error("Error connecting to mongoDB :", error.message);
//   });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/upload", upload.single("product"), (req, res) => {
//   //Upload to Cloudinary
//   cloudinary.uploader.upload(req.file.path, async (error, result) => {
//     if (error) {
//       return res
//         .status(500)
//         .json({ message: "Failed to upload to Cloudinary" });
//     }

//     //Get the URL of the uploaded image
//     const imageUrl = result.secure_url;

//     //  Delete the file from the local machine
//     fs.unlink(req.file.path, (err) => {
//       if (err) {
//         console.error("Error deleting file from local storage:", err);
//       } else {
//         console.log("File deleted from local storage.");
//       }
//     });

//     //console.log(imageUrl);

//     //  Send response back to frontend with the image URL
//     res.json({
//       success: true,
//       message: "File uploaded and deleted from local storage",
//       imageUrl,
//       imagePublicId: result.public_id, // Include public_id
//     });
//   });
// });

// // Schema for creating Products
// // Modify the Product schema to include stock quantity
// const Product = mongoose.model("Product", {
//   id: {
//     type: Number,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   image_public_id: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   new_price: {
//     type: Number,
//     required: true,
//   },
//   old_price: {
//     type: Number,
//     required: true,
//   },
//   stock: {
//     type: Number,
//     default: 0,
//   },
// });

// app.post("/addProduct", upload.single("product"), async (req, res) => {
//   console.log(req.body.image);
//   if (!req.body.image) {
//     return res
//       .status(400)
//       .json({ success: false, message: "No file uploaded." });
//   }

//   // Upload to Cloudinary
//   cloudinary.uploader.upload(req.body.image, async (error, result) => {
//     if (error) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to upload to Cloudinary." });
//     }
//     // Create a new product with Cloudinary image URL and public ID
//     const {
//       name,
//       category,
//       image,
//       new_price,
//       old_price,
//       image_public_id,
//       stock,
//     } = req.body;
//     const count = await Product.countDocuments();
//     const newProduct = new Product({
//       id: count + 1,
//       name,
//       image: image, // Use Cloudinary image URL
//       image_public_id: image_public_id, // Use Cloudinary public ID
//       category,
//       new_price,
//       old_price,
//       stock,
//     });

//     //  Save the product to the database
//     try {
//       await newProduct.save();
//       res.json({ success: true, message: "Product added successfully!" });
//       // console.log(newProduct);
//     } catch (error) {
//       res.json({ success: false, message: error.message });
//     }

//     // Delete the file from the local machine after upload
//     fs.unlink(req.body.image, (err) => {
//       if (err) {
//         console.error("Error deleting file from local storage:", err);
//       }
//     });
//   });
// });

// app.get("/allProducts", async (req, res) => {
//   try {
//     const allProducts = await Product.find({});
//     //console.log(allProducts);
//     res.json(allProducts);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching products.",
//     });
//   }
// });

// app.post("/removeProduct", async (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({
//       success: false,
//       message: "Product ID is required.",
//     });
//   }

//   try {
//     let product;

//     // Check if the id is a valid MongoDB ObjectId
//     if (mongoose.Types.ObjectId.isValid(id)) {
//       // If valid ObjectId, delete by _id
//       product = await Product.findByIdAndDelete(id);
//     } else {
//       // If it's not a valid ObjectId, delete by image_public_id or another custom field
//       product = await Product.findOneAndDelete({ image_public_id: id });
//     }

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: `Product with ID ${id} not found.`,
//       });
//     }

//     // Assuming you want to destroy the image on Cloudinary if the product is found
//     await cloudinary.uploader.destroy(product.id);

//     res.json({
//       success: true,
//       message: `Product "${product.name}" has been deleted successfully.`,
//     });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the product.",
//     });
//   }
// });

// app.post("/updateStock", async (req, res) => {
//   const { name, stock } = req.body;
//   const updatedStock = Number(stock);

//   if (!name || isNaN(updatedStock)) {
//     return res.status(400).json({
//       success: false,
//       message: "Product name and updated stock are required.",
//     });
//   }

//   try {
//     const product = await Product.findOne({ name });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found.",
//       });
//     }

//     // Ensure stock never goes below 0
//     const newStock = Math.max(0, product.stock + updatedStock);

//     const updatedProduct = await Product.findOneAndUpdate(
//       { name },
//       { stock: newStock }, // Set stock to the updated value
//       { new: true } // Return updated document
//     );

//     console.log(updatedProduct);

//     res.json({
//       success: true,
//       message: `Stock for product "${name}" updated successfully!`,
//       updatedStock: updatedProduct.stock,
//     });
//   } catch (error) {
//     console.error("Error updating stock:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the stock.",
//     });
//   }
// });

// const User = mongoose.model("User", {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   cartData: {
//     type: Object,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   address: {
//     fullName: String,
//     phone: String,
//     street: String,
//     city: String,
//     state: String,
//     zip: String,
//     country: String,
//   },
// });

// const Admin = mongoose.model("Admin", {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
// });

// const processedPaymentSchema = new mongoose.Schema({
//   paymentIntent: { 
//     type: String,
//      unique: true, 
//      required: true,
//      },
//   processed: {
//      type: Boolean, 
//      default: false ,
//     },
//   createdAt: { 
//     type: Date, 
//     default: Date.now,
//    },
// });

// const ProcessedPayment = mongoose.model(
//   "ProcessedPayment",
//   processedPaymentSchema
// );

// const OrderTableSchema = new mongoose.Schema({
//   userEmail: {
//    type : String,
//     unique:true,
//   },
//   products: [
//     {
//       productId: {
//         type : Number,
//         required: true,
//       },
//       name: String,
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       image: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// const CommentTableSchema = new mongoose.Schema({
//   productId: { 
//     type: String,
//    },

//   comments : [
//     {
//       userName : {
//         type : String,
//         required : true,
//       },
//       comment :{
//         type : String,
//         required : true,
//       },
//       date : {
//         type : Date,
//         default : Date.now,
//       },
//     }
//   ]
// });


// const CommentTable = mongoose.model('CommentTable',CommentTableSchema);

// const OrderTable = mongoose.model("OrderTable", OrderTableSchema);

// app.post("/signup", async (req, res) => {
//   let check = await User.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({
//       success: false,
//       errors: "Existing user found with the same email address",
//     });
//   }
//   const allProduct = Product.find({});
//   const len = Object.keys(allProduct).length;
//   let cart = {};
//   for (let i = 0; i <=len; i++) {
//     cart[i] = 0;
//   }

//   const newUser = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     cartData: cart,
//   });
//   await newUser.save();

//   const data = {
//     user: {
//       id: newUser.id,
//     },
//   };

//   const token = jwt.sign(data, process.env.SALT_KEY); // salting
//   res.json({ success: true, token });
// });

// app.post("/Adminsignup", async (req, res) => {
//   const adminCount = await Admin.countDocuments();

//   if (adminCount >= 1) {
//     return res.status(400).json({
//       success: false,
//       errors: "Admin Access Window Size Exceed",
//     });
//   }

//   let check = await Admin.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({
//       success: false,
//       errors: "Existing user found with the same email address",
//     });
//   }

//   const newAdmin = new Admin({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   });
//   await newAdmin.save();

//   const data = {
//     user: {
//       id: newAdmin.id,
//     },
//   };

//   const token = jwt.sign(data, process.env.SALT_KEY); // salting
//   res.json({ success: true, token });
// });

// app.post("/login", async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     const passCompare = user.password === req.body.password;
//     if (passCompare) {
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       const token = jwt.sign(data, process.env.SALT_KEY);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, errors: "Wrong Password" });
//     }
//   } else {
//     res.json({ success: false, errors: "Sign In First!" });
//   }
// });

// app.post("/Adminlogin", async (req, res) => {
//   const AdminUser = await Admin.findOne({ email: req.body.email });
//   if (AdminUser) {
//     const passCompare = AdminUser.password === req.body.password;
//     if (passCompare) {
//       const data = {
//         AdminUser: {
//           id: AdminUser.id,
//         },
//       };
//       const token = jwt.sign(data, process.env.SALT_KEY);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, errors: "Wrong Password" });
//     }
//   } else {
//     res.json({ success: false, errors: "Sign In First!" });
//   }
// });

// // creating endpoint for newcollection data

// app.get("/newcollections", async (req, res) => {
//   let products = await Product.find({});
//   let newcollection = products.slice(1).slice(-8); // last 8 products will be added to new collection
//   res.send(newcollection);
// });

// //creating endPoint for Popular in women data;

// app.get("/popularinwomen", async (req, res) => {
//   let products = await Product.find({ category: "women" });
//   let popularInWomen = products.slice(0, 4); // only 4 products 0 to 4
//   res.send(popularInWomen);
// });

// const fetchUser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     return res
//       .status(401)
//       .send({ errors: "Please authenticate using a valid token" });
//   }
//   try {
//     const data = jwt.verify(token, process.env.SALT_KEY);
//     req.user = data.user;
//     next();
//   } catch (error) {
//     return res
//       .status(401)
//       .send({ errors: "Please authenticate using a valid token" });
//   }
// };

// app.post("/addtocart", fetchUser, async (req, res) => {
//   let userData = await User.findOne({ _id: req.user.id });
//   userData.cartData[req.body.itemId] += 1;
//   await User.findOneAndUpdate(
//     { _id: req.user.id },
//     { cartData: userData.cartData }
//   );
// });

// app.post("/removefromcart", fetchUser, async (req, res) => {
//   let userData = await User.findOne({ _id: req.user.id });
//   if (userData.cartData[req.body.itemId] > 0) {
//     userData.cartData[req.body.itemId] -= 1;
//   }
//   await User.findOneAndUpdate(
//     { _id: req.user.id },
//     { cartData: userData.cartData }
//   );
// });

// app.get("/cart", fetchUser, async (req, res) => {
//   let userData = await User.findOne({ _id: req.user.id });
//   let cartItems = userData.cartData;
//   let items = [];
//   for (let key in cartItems) {
//     if (cartItems[key] > 0) {
//       let product = await Product.findById(key);
//       items.push({
//         product: product,
//         quantity: cartItems[key],
//       });
//     }
//   }
//   res.send(items);
// });

// app.post("/totalcartitems", fetchUser, async (req, res) => {
//   let userData = await User.findOne({ _id: req.user.id });
//   res.json(userData.cartData);
// });

// // Example endpoint to check stock
// app.get("/checkStock/:productId", async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const product = await Product.findOne({ id: productId });
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found." });
//     }

//     const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
//     res.json({ success: true, stockStatus });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.post("/checkStockInCart", async (req, res) => {
//   try {
//     // console.log("Received Request Body:", req.body);

//     const { products: productQuantities } = req.body; // Expecting an object { productId: desiredQuantity }
//     if (!productQuantities || typeof productQuantities !== "object") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid productQuantities format" });
//     }

//     const productIds = Object.keys(productQuantities);
//     // console.log("Fetching Stock for Product IDs:", productIds);

//     const products = await Product.find({
//       id: { $in: productIds.map(Number) },
//     });

//     // console.log("Fetched Products:", products);

//     const stockStatus = productIds.reduce((acc, id) => {
//       const product = products.find((p) => p.id === Number(id));
//       acc[id] = product ? product.stock >= productQuantities[id] : false; // Ensure stock meets demand
//       return acc;
//     }, {});

//     // console.log("Final Stock Status:", stockStatus);

//     res.json({ success: true, stockStatus });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// app.post("/clientDetails", async (req, res) => {
//   const { email, address } = req.body; // Identify user by email

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { $set: { address } }, // Update the address field
//       { new: true } // Return updated user
//     );

//     if (!updatedUser) return res.status(404).json({ error: "User not found" });

//     res.json({
//       message: "Address updated successfully",
//       address: updatedUser.address,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating address" });
//   }
// });

// app.post("/buy-now-checkout", async (req, res) => {
//   const { id, name, new_price, image, quantity } = req.body;

//   if (!id || !name || !new_price || !quantity) {
//     return res.status(400).json({ error: "Invalid request data." });
//   }

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: name,
//               image : [image],
//              },
//             unit_amount: Math.round(new_price * 100),
//           },
//           quantity: quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: "http://localhost:5173/failure",
//       metadata: {
//         type: "buy-now", // Identifies "Buy Now" checkout
//         cart: JSON.stringify({
//             id: id,
//             name : name,
//             price : new_price,
//             image : image,
//             quantity: quantity,
//             createdAt : new Date(),
//       }),
//       },
//     });

//     console.log("buy-now : " , req.body);

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Stripe checkout error:", error);
//     res.status(500).json({ error: "Checkout session creation failed." });
//   }
// });

// app.post("/create-checkout-session", async (req, res) => {
//   const products = req.body.products;
//   const cartItems = req.body.quantity;
//   const total_amount = req.body.total_amount;

//   if (
//     !products ||
//     products.length === 0 ||
//     !cartItems ||
//     Object.keys(cartItems).length === 0
//   ) {
//     return res
//       .status(400)
//       .json({ error: "The cart is empty. Please add items to the cart." });
//   }

//   const validProducts = products.filter((item) => cartItems[item.id] > 0);

//   if (validProducts.length === 0) {
//     return res
//       .status(400)
//       .json({ error: "No valid products found in the cart." });
//   }

//   const items = validProducts.map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: item.name,
//          images: [item.image] , 
//          // because stripe doesn't access private url for that we have to use public clouds
//       },
//       unit_amount: Math.round(item.new_price * 100),
//     },
//     quantity: cartItems[item.id],
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: items,
//     mode: "payment",
//     metadata: {
//       type: "cart-checkout", // Identifies "Cart Checkout"
//       cart: JSON.stringify(
//         validProducts.map((item) => ({
//           id: item.id,
//           name : item.name,
//           price : item.new_price,
//           image : item.image,
//           quantity: cartItems[item.id],
//           createdAt : new Date(),
//         }))
//       ),
//     },
//     success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: "http://localhost:5173/failure",
//   });

//   console.log("checkout: ",validProducts);

//   res.json({ id: session.id });
// });

// app.get("/check-payment-status/:sessionId", async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;

//     // Retrieve session details from Stripe
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     if (session.payment_status !== "paid") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Payment not completed." });
//     }

//     const paymentIntent = session.payment_intent; // Unique per payment

//     //  Check if this paymentIntent was already processed
//     const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
//     if (existingPayment) {
//       console.log("payment already processed");
//       return res
//         .status(400)
//         .json({ success: false, message: "Payment already processed." });
//     }

//     // Process stock update based on metadata
//     const metadata = session.metadata || {};

//     // if (metadata.type === "buy-now") {
//     //   await Product.findOneAndUpdate(
//     //     { id: metadata.productId },
//     //     { $inc: { stock: -1 } }
//     //   );
//     // } else {
//       const cartItems = JSON.parse(metadata.cart || "[]");
//       for (const item of cartItems) {
//         await Product.findOneAndUpdate(
//           { id: item.id },
//           { $inc: { stock: -item.quantity } }
//         );
//       }
//     //}

//     //  Store processed paymentIntent to prevent future duplicate processing
//     await ProcessedPayment.create({ paymentIntent, processed: true });

//     const orderProducts = cartItems.map((item) => ({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       image: item.image, 
//       quantity: item.quantity,
//       createdAt: item.createdAt,
//     }));

//     console.log("Stock updated successfully!");
//     res.json({ success: true, message: "Stock updated successfully!", orderProducts });
//   } catch (error) {
//     console.error("Error checking payment status:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.post("/addOrder", fetchUser, async (req, res) => {
//   console.log("addOrder : ",req.body);
//   console.log("addorder : ", req.user);
//   try {
//     const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
//     console.log("addOrder : ", user.email);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//   }
//     const { products } = req.body;

//     if (!products || products.length === 0) {
//       return res.status(400).json({ error: "No products in the order" });
//     }

//     // ✅ Create structured product data including `imageUrl`, `quantity`, and `price`
//     const orderProducts = products.map((item) => ({
//       productId: item.id,
//       name: item.name,
//       price: item.price,
//       image: item.image,
//       quantity: item.quantity,
//       createdAt : item.createdAt,
//     }));

//     let existingUser = await OrderTable.findOne({ userEmail : user.email });

//     if (existingUser) {
//       existingUser.products.push(...orderProducts);
//       // existingUser.createdAt = Date.now();
//       await existingUser.save(); // updates the document if it already exists.
//     } else {
//       existingUser = new OrderTable({
//         userEmail : user.email,
//         products: orderProducts,
//       });
//       await existingUser.save();
//     }

//     await User.findByIdAndUpdate(req.user.email, {
//       $push: { orders: existingUser._id },
//     });

//     res.status(201).json({ message: "Order updated successfully", order: existingUser });
//   } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// app.get('/orderHistory', fetchUser, async (req, res) => {
//   try {
//     const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
//     const orders = await OrderTable.find({ userEmail: user.email }).lean(); // Get all orders

//     // Sort products inside each order by createdAt (from newest to oldest)
//     orders.forEach(order => {
//       if (order.products && order.products.length > 0) {
//         order.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort products in descending order based on createdAt
//       }
//     });
//     orders.sort((a, b) => {
//       // If both orders have products, compare the createdAt of the first product (most recent after sorting)
//       if (a.products.length > 0 && b.products.length > 0) {
//         return new Date(b.products[0].createdAt) - new Date(a.products[0].createdAt);
//       }
//       // If one of the orders doesn't have products, place it at the end
//       if (a.products.length === 0) return 1;
//       if (b.products.length === 0) return -1;
//       return 0; // In case both have no products (shouldn't happen as per your structure)
//     });
    
//     console.log(orders); 

//     if (!orders || orders.length === 0) {
//       console.log("orerHistory: ",orders);
//       return res.status(404).json({ message: "No order history found" });
//     }

//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     console.log("catch : ", orders);
//     res.status(500).json({ error: "Internal Server Error" });
    
//   }
// });

// app.get('/comments',async(req,res) =>{
//   //console.log(req.query.productId);
//   try {
//     const productId = req.query.productId;


//     // Fetch all comments related to the given `productId`
//     const commentList = await CommentTable.findOne({ productId });
//     //console.log("comments : ", comments);

//     if (commentList.length === 0) {
//       return res.status(404).json({ message: 'No comments found for this product.' });
//     }
//     //console.log(comments);

//     return res.status(200).json(commentList);
//   } catch (err) {
//     console.error('Error fetching comments:', err);
//     return res.status(500).json({ message: 'Server error while fetching comments.' });
//   }
// });

// app.post('/comments', fetchUser, async (req, res) => {
//   try {
//     const productId = req.query.productId; // Get the productId from the URL
//     const { commentText } = req.body; // Get the comment text from the request body
//     const user = await User.findById(new mongoose.Types.ObjectId(req.user.id)); // Get the user from the request
//     console.log(commentText);

//     if (!user) {
//       return res.status(400).json({ message: "User must be logged in to comment." });
//     }

//     if (!commentText || commentText.trim() === "") {
//       return res.status(400).json({ message: "Comment text is required." });
//     }

//     // Use `let` instead of `const` so it can be reassigned
//     let product = await CommentTable.findOne({ productId });

//     if (!product) {
//       // If product doesn't exist, create a new entry
//       product = new CommentTable({
//         productId,
//         comments: [
//           {
//             userName: user.name,
//             comment: commentText,
//           },
//         ],
//       });
//     } else {
//       // If product exists, push the new comment to the comments array
//       product.comments.push({
//         userName: user.name,
//         comment: commentText,
//       });
//     }

//     // Save the updated product (or new product)
//     await product.save();

//     res.status(201).json({ message: "Comment added successfully!" });
//   } catch (err) {
//     console.error('Error adding comment:', err);
//     res.status(500).json({ message: "Server error while adding comment." });
//   }
// });


// // app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
// //   console.log("🚀 Webhook received!");

// //   const sig = req.headers["stripe-signature"];
// //   if (!sig) {
// //       console.error("⚠️ No stripe-signature header found!");
// //       return res.status(400).send("No stripe-signature header found!");
// //   }

// //   const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK;
// //   let event;

// //   console.log(req.body.data);

// //   try {
// //       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
// //   } catch (err) {
// //       console.error("❌ Webhook Error:", err.message);
// //       return res.status(400).send(`Webhook Error: ${err.message}`);
// //   }

// //   console.log("✅ Event Type:", event.type);
// //   console.log("🔹 Full Event:", JSON.stringify(event, null, 2));

// //   if (!event.data) {
// //       console.error("⚠️ Warning: event.data is undefined!");
// //   } else {
// //       console.log("🔹 Event Data:", event.data);
// //   }

// //   res.json({ received: true });
// // });

// // app.post('/webhook',express.raw({ type: 'application/json'}),async (req, res) => {
// //   const sig = req.headers['stripe-signature'];
// //     const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK;
// //     //console.log("hello");

// //     let event;
// //     try {
// //       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
// //     } catch (err) {
// //       console.error("Webhook Error:", err.message);
// //       return res.status(400).send(`Webhook Error: ${err.message}`);
// //     }

// //     console.log(event.type);
// //     console.log(event.data.object);
// //     console.log(event.data.object.id);

// //     if (event.type === "checkout.session.completed") {
// //       const session = event.data.object;
// //       console.log("Payment Successful:", session);

// //       // Read Metadata
// //       const metadata = session.metadata || {};
// //       console.log("Received Metadata:", metadata);

// //       const isBuyNow = metadata.type === "buy-now";
// //       const cartItems = JSON.parse(metadata.cart || "[]");

// //       try {
// //         if (isBuyNow) {
// //           const productId = new mongoose.Types.ObjectId(metadata.productId);
// //           const quantity = Number(metadata.quantity);

// //           const updatedProduct = await Product.findOneAndUpdate(
// //             { _id: productId },
// //             { $inc: { stock: -quantity } }, // Decrease stock
// //             { new: true, runValidators: true } // Return updated product & validate
// //           );

// //           if (updatedProduct) {
// //             console.log(
// //               `Stock updated: ${updatedProduct._id} | New stock: ${updatedProduct.stock}`
// //             );
// //           } else {
// //             console.error(`Product not found for ID ${productId}`);
// //           }
// //         } else {
// //           for (const item of cartItems) {
// //             const productId = new mongoose.Types.ObjectId(item.id);
// //             const quantity = Number(item.quantity);

// //             const updatedProduct = await Product.findOneAndUpdate(
// //               { _id: productId },
// //               { $inc: { stock: -quantity } },
// //               { new: true, runValidators: true }
// //             );

// //             if (updatedProduct) {
// //               console.log(
// //                 `Stock updated: ${updatedProduct._id} | New stock: ${updatedProduct.stock}`
// //               );
// //             } else {
// //               console.error(`Product not found for ID ${productId}`);
// //             }
// //           }
// //         }
// //         console.log("Stock update process completed!");
// //       } catch (err) {
// //         console.error("Stock update failed:", err);
// //       }
// //     }

// //     res.json({ received: true });
// //   }
// // );

// // app.post('/webhook', bodyparser.raw({ type: "application/json" }), async (req, res) => {
// //   console.log("🚀 Webhook endpoint hit!");

// //   const sig = req.headers["stripe-signature"];
// //   const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK;

// //   if (!sig) {
// //       console.error("❌ Missing Stripe signature");
// //       return res.status(400).send("Missing Stripe signature");
// //   }

// //   let event;
// //   try {
// //       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
// //   } catch (err) {
// //       console.error("❌ Webhook Error:", err.message);
// //       return res.status(400).send(`Webhook Error: ${err.message}`);
// //   }

// //   console.log("✅ Webhook Event Received:", event.type);

// //   res.json({ received: true });
// // });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });





const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const port = process.env.PORT || 4000;

const bodyparser = require("body-parser");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());

app.use(cors()); // is use to connect the frontend to backend

const uri = `mongodb+srv://shawadharsh:${process.env.DATABASE_SECRET}-commerce@cluster0.si5qwdm.mongodb.net/e-commerce`;

//Database connection with Mongodb
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to mongoDB :", error.message);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("product"), (req, res) => {
  //Upload to Cloudinary
  cloudinary.uploader.upload(req.file.path, async (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to upload to Cloudinary" });
    }

    //Get the URL of the uploaded image
    const imageUrl = result.secure_url;

    //  Delete the file from the local machine
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file from local storage:", err);
      } else {
        console.log("File deleted from local storage.");
      }
    });

    //console.log(imageUrl);

    //  Send response back to frontend with the image URL
    res.json({
      success: true,
      message: "File uploaded and deleted from local storage",
      imageUrl,
      imagePublicId: result.public_id, // Include public_id
    });
  });
});

// Schema for creating Products
// Modify the Product schema to include stock quantity
const Product = mongoose.model("Product", {
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_public_id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

app.post("/addProduct", upload.single("product"), async (req, res) => {
  // console.log(req.body.image);
  if (!req.body.image) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }

  // Upload to Cloudinary
  cloudinary.uploader.upload(req.body.image, async (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload to Cloudinary." });
    }
    // Create a new product with Cloudinary image URL and public ID
    const {
      name,
      category,
      image,
      new_price,
      old_price,
      image_public_id,
      stock,
    } = req.body;
    const count = await Product.countDocuments();
    const newProduct = new Product({
      id: count + 1,
      name,
      image: image, // Use Cloudinary image URL
      image_public_id: image_public_id, // Use Cloudinary public ID
      category,
      new_price,
      old_price,
      stock,
    });

    //  Save the product to the database
    try {
      await newProduct.save();
      res.json({ success: true, message: "Product added successfully!" });
      // console.log(newProduct);
    } catch (error) {
      res.json({ success: false, message: error.message });
    }

    // Delete the file from the local machine after upload
    fs.unlink(req.body.image, (err) => {
      if (err) {
        console.error("Error deleting file from local storage:", err);
      }
    });
  });
});

app.get("/allProducts", async (req, res) => {
  try {
    const allProducts = await Product.find({});
    //console.log(allProducts);
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
});

app.post("/removeProduct", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    let product;

    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If valid ObjectId, delete by _id
      product = await Product.findByIdAndDelete(id);
    } else {
      // If it's not a valid ObjectId, delete by image_public_id or another custom field
      product = await Product.findOneAndDelete({ image_public_id: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Assuming you want to destroy the image on Cloudinary if the product is found
    await cloudinary.uploader.destroy(product.id);

    res.json({
      success: true,
      message: `Product "${product.name}" has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product.",
    });
  }
});

app.post("/updateStock", async (req, res) => {
  const { name, stock } = req.body;
  const updatedStock = Number(stock);

  if (!name || isNaN(updatedStock)) {
    return res.status(400).json({
      success: false,
      message: "Product name and updated stock are required.",
    });
  }

  try {
    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Ensure stock never goes below 0
    const newStock = Math.max(0, product.stock + updatedStock);

    const updatedProduct = await Product.findOneAndUpdate(
      { name },
      { stock: newStock }, // Set stock to the updated value
      { new: true } // Return updated document
    );

    //console.log(updatedProduct);

    res.json({
      success: true,
      message: `Stock for product "${name}" updated successfully!`,
      updatedStock: updatedProduct.stock,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the stock.",
    });
  }
});

const tempUser = mongoose.model("tempUser", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});





const User = mongoose.model("User", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
});

const tempAdmin = mongoose.model("tempAdmin", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});
const Admin = mongoose.model("Admin", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const processedPaymentSchema = new mongoose.Schema({
  paymentIntent: {
    type: String,
    unique: true,
    required: true,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProcessedPayment = mongoose.model(
  "ProcessedPayment",
  processedPaymentSchema
);

const OrderTableSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    unique: true,
  },
  products: [
    {
      productId: {
        type: Number,
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      address: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

    },
  ],

});

const CommentTableSchema = new mongoose.Schema({
  productId: {
    type: String,
  },

  comments: [
    {
      userName: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const CommentTable = mongoose.model("CommentTable", CommentTableSchema);

const OrderTable = mongoose.model("OrderTable", OrderTableSchema);

app.post('/verify-email', async (req,res) => {
  const user = req.body;
  if (!user.email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  // Check if email already exists
  const existingUser = await tempUser.findOne({email: user.email });

  if (existingUser) {
    await tempUser.deleteOne(existingUser);
    return res.status(409).json({ success: false, message: "Something wrong Occured Try Again!" });

  }

  const foundUser = await User.findOne({email : user.email});

  console.log("foundUser" , foundUser);

  if(foundUser === null || foundUser === undefined){

    const newUser = new tempUser({
      name: user.name,
      email: user.email,
      password: user.password,

    });
    await newUser.save();
    return res.status(200).json({
      success : true, 
      });
  }


  return res.status(400).json({
    success: false,
    errors: "Existing user found with the same email address",
  });

});

// app.post('/verify-email', async (req,res) => {
//   const user = req.body;

//   const foundUser = await User.findOne({email : user.email});

//   console.log("foundUser" , foundUser);

//   if(foundUser === null || foundUser === undefined){

//     const newUser = new tempUser({
//       name: user.name,
//       email: user.email,
//       password: user.password,

//     });
//     await newUser.save();
//     return res.status(200).json({
//       success : true, 
//       });
//   }

//   await tempUser.deleteOne(foundUser);

//   return res.status(400).json({
//     success: false,
//     errors: "Existing user found with the same email address",
//   });

// });

app.post('/verify-email-signup', async (req,res) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount >= 1) {
    return res.status(400).json({
      success: false,
      errors: "Admin Access Window Size Exceed",
    });
  }
  const admin = req.body;

  const foundUser = await Admin.findOne({email : admin.email});
  console.log("foundUser" , foundUser);

  if(foundUser === null || foundUser === undefined){
    const newAdmin = new tempAdmin({
      name: admin.name,
      email: admin.email,
      password: admin.password,

    });
    await newAdmin.save();
    return res.status(200).json({
      success : true, 
      });
  }
await tempAdmin.deleteOne(foundUser);
  return res.status(400).json({
    success: false,
    errors: "Existing Admin found with the same email address",
  });

});

// app.post("/signup", async (req, res) => {
//   const {email} = req.body.email;
//   let check = await User.findOne({ email: email});
//   if (check) {
//     return res.status(400).json({
//       success: false,
//       errors: "Existing user found with the same email address",
//     });
//   }

//   const user = await tempUser.findOne({email:email});


//   let cart = {};
//   const totalProduct = Product.find({});
//   const len = Object.keys(totalProduct).length;
//   for (let i = 0; i <= len ; i++) {
//     cart[i] = 0;
//   }

//   const newUser = new User({
//     name: user.name,
//     email: user.email,
//     password: user.password,
//     cartData: cart,
//   });
//   await newUser.save();
//   await tempUser.deleteOne(user);

//   const data = {
//     user: {
//       id: newUser.id,
//     },
//   };

//   const token = jwt.sign(data, process.env.SALT_KEY); // salting
//   res.json({ success: true, token });
// });


app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    let check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with the same email address",
      });
    }

    // Check if user is in tempUser collection
    const user = await tempUser.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: "User not found in tempUser database",
      });
    }

    // Fetch all products
    const totalProduct = await Product.find({});
    let cart = {};
    const len = totalProduct.length;
    
  for(let i = 1;i<=len;i++ ){
    cart[i] = 0;
  }

    // Create a new user
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password, // Ensure password is stored in tempUser
      cartData: cart,
    });

    await newUser.save();
    await tempUser.deleteOne({ email: user.email });

    // Create JWT token
    const data = { user: { id: newUser.id } };
    const token = jwt.sign(data, process.env.SALT_KEY);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
});


app.post("/Adminsignup", async (req, res) => {

  let check = await Admin.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  }

  const admin = await tempAdmin.findOne({email : req.body.email});

  const newAdmin = new Admin({
    name: admin.name,
    email: admin.email,
    password: admin.password,
  });
  await newAdmin.save();

  await tempAdmin.deleteOne(admin);

  const data = {
    user: {
      id: newAdmin.id,
    },
  };

  const token = jwt.sign(data, process.env.SALT_KEY); // salting
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const passCompare = user.password === req.body.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.SALT_KEY);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Sign In First!" });
  }
});

app.post("/Adminlogin", async (req, res) => {
  const AdminUser = await Admin.findOne({ email: req.body.email });
  if (AdminUser) {
    const passCompare = AdminUser.password === req.body.password;
    if (passCompare) {
      const data = {
        AdminUser: {
          id: AdminUser.id,
        },
      };
      const token = jwt.sign(data, process.env.SALT_KEY);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Sign In First!" });
  }
});

// creating endpoint for newcollection data

app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8); // last 8 products will be added to new collection
  res.send(newcollection);
});

//creating endPoint for Popular in women data;

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popularInWomen = products.slice(0, 4); // only 4 products 0 to 4
  res.send(popularInWomen);
});

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.SALT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};

app.post("/addtocart", fetchUser, async (req, res) => {
  console.log(req.user);
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
});

app.get("/cart", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  let cartItems = userData.cartData;
  let items = [];
  for (let key in cartItems) {
    if (cartItems[key] > 0) {
      let product = await Product.findById(key);
      items.push({
        product: product,
        quantity: cartItems[key],
      });
    }
  }
  res.send(items);
});

app.post("/totalcartitems", fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if(userData === null) res.json(null);
  res.json(userData.cartData);
});

// Example endpoint to check stock
app.get("/checkStock/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
    res.json({ success: true, stockStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/checkStockInCart", async (req, res) => {
  try {
    // console.log("Received Request Body:", req.body);

    const { products: productQuantities } = req.body; // Expecting an object { productId: desiredQuantity }
    if (!productQuantities || typeof productQuantities !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid productQuantities format" });
    }

    const productIds = Object.keys(productQuantities);
    // console.log("Fetching Stock for Product IDs:", productIds);

    const products = await Product.find({
      id: { $in: productIds.map(Number) },
    });

    // console.log("Fetched Products:", products);

    const stockStatus = productIds.reduce((acc, id) => {
      const product = products.find((p) => p.id === Number(id));
      acc[id] = product ? product.stock >= productQuantities[id] : false; // Ensure stock meets demand
      return acc;
    }, {});

    // console.log("Final Stock Status:", stockStatus);

    res.json({ success: true, stockStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/clientDetails", fetchUser, async (req, res) => {
  const address = req.body.address; // Identify user by email
  //console.log(req.user);

  //const email = req.user.email;
  //console.log(address);

  let userData = await User.findOne({ _id: req.user.id });
  //console.log(userData);

  const email = userData.email;


  console.log(email);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { address } }, // Update the address field
      { new: true } // Return updated user
    );

    console.log(updatedUser);

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Address updated successfully",
      address: updatedUser.address,
    });
  } catch (error) {
    console.log("error");
    res.status(500).json({ error: "Error updating address" });
  }
});

app.post("/buy-now-checkout", async (req, res) => {
  const { id, name, new_price, image, quantity } = req.body;

  if (!id || !name || !new_price || !quantity) {
    return res.status(400).json({ error: "Invalid request data." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: name, 
              images: [image],
             },
            unit_amount: Math.round(new_price * 100),
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/failure",
      metadata: {
        type: "buy-now", // Identifies "Buy Now" checkout
        cart: JSON.stringify({
          id: id,
          name: name,
          price: new_price,
          images: image,
          quantity: quantity,
          createdAt: new Date(),
        }),
      },
    });

    //console.log("buy-now : ", req.body);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Checkout session creation failed." });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const products = req.body.products;
  const cartItems = req.body.quantity;
  const total_amount = req.body.total_amount;

  if (
    !products ||
    products.length === 0 ||
    !cartItems ||
    Object.keys(cartItems).length === 0
  ) {
    return res
      .status(400)
      .json({ error: "The cart is empty. Please add items to the cart." });
  }

  const validProducts = products.filter((item) => cartItems[item.id] > 0);

  if (validProducts.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid products found in the cart." });
  }

  const items = validProducts.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
        // because stripe doesn't access private url for that we have to use public clouds
      },
      unit_amount: Math.round(item.new_price * 100),
    },
    quantity: cartItems[item.id],
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    metadata: {
      type: "cart-checkout", // Identifies "Cart Checkout"
      cart: JSON.stringify(
        validProducts.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.new_price,
          images: item.image,
          quantity: cartItems[item.id],
          createdAt: new Date(),
        }))
      ),
    },
    success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:5173/failure",
  });

  //console.log("checkout: ", validProducts);

  res.json({ id: session.id });
});

app.get("/check-payment-status/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed." });
    }

    const paymentIntent = session.payment_intent; // Unique per payment

    //  Check if this paymentIntent was already processed
    const existingPayment = await ProcessedPayment.findOne({ paymentIntent });
    if (existingPayment) {
      console.log("payment already processed");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Transaction" });
    }

    // Process stock update based on metadata
    const metadata = session.metadata || {};

    const cartItems = JSON.parse(metadata.cart || "[]");

    if (metadata.type === "buy-now") {
      await Product.findOneAndUpdate(
        { id: cartItems.id },
        { $inc: { stock: -1 } },
        { new: true },
      );
    } else {
    for (const item of cartItems) {
      await Product.findOneAndUpdate(
        { id: item.id },
        { $inc: { stock: -item.quantity } }
      );
    }
    }

    //  Store processed paymentIntent to prevent future duplicate processing
    await ProcessedPayment.create({ paymentIntent, processed: true });

    let orderProducts = {};

    console.log(metadata);

    if (metadata.type === "buy-now") {
      orderProducts = [{
        id: cartItems.id,
        name: cartItems.name,
        price: cartItems.price,
        image: cartItems.images,
        quantity: 1,  // Ensure quantity is correctly assigned
        createdAt: cartItems.createdAt,
      }];
    } else {
      orderProducts = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images,
        quantity: item.quantity,
        createdAt: item.createdAt,
      }));
    }

    console.log("Stock updated successfully!");
    res.json({
      success: true,
      message: "Stock updated successfully!",
      orderProducts,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/addOrder", fetchUser, async (req, res) => {
  console.log("addOrder : ", req.body);
  console.log("addorder : ", req.user);
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
    //console.log("addOrder : ", user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products in the order" });
    }

    // ✅ Create structured product data including `imageUrl`, `quantity`, and `price`
  console.log(products);
    const orderProducts = products.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      address : {

        fullName: user.address.fullName,
        phone: user.address.phone,
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zip:user.address.zip,
        country: user.address.country,

      },
      createdAt: item.createdAt,
    }));

    let existingUser = await OrderTable.findOne({ userEmail: user.email });

    if (existingUser) {
      existingUser.products.push(...orderProducts);
      // existingUser.createdAt = Date.now();
      await existingUser.save(); // updates the document if it already exists.
    } else {
      existingUser = new OrderTable({
        userEmail: user.email,
        products: orderProducts,
      });
      await existingUser.save();
    }

    await User.findByIdAndUpdate(req.user.email, {
      $push: { orders: existingUser._id },
    });

    res
      .status(201)
      .json({ message: "Order updated successfully", order: existingUser });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/orderHistory", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
    const orders = await OrderTable.find({ userEmail: user.email }).lean(); // Get all orders

    // Sort products inside each order by createdAt (from newest to oldest)
    orders.forEach((order) => {
      if (order.products && order.products.length > 0) {
        order.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort products in descending order based on createdAt
      }
    });
    orders.sort((a, b) => {
      // If both orders have products, compare the createdAt of the first product (most recent after sorting)
      if (a.products.length > 0 && b.products.length > 0) {
        return (
          new Date(b.products[0].createdAt) - new Date(a.products[0].createdAt)
        );
      }
      // If one of the orders doesn't have products, place it at the end
      if (a.products.length === 0) return 1;
      if (b.products.length === 0) return -1;
      return 0; // In case both have no products (shouldn't happen as per your structure)
    });

    //console.log(orders);

    if (!orders || orders.length === 0) {
      console.log("orerHistory: ", orders);
      return res.status(404).json({ message: "No order history found" });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    console.log("catch : ", orders);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/comments", async (req, res) => {
  //console.log(req.query.productId);
  try {
    const productId = req.query.productId;

    // Fetch all comments related to the given `productId`
    const commentList = await CommentTable.findOne({ productId });
    //console.log("comments : ", comments);

    if (commentList === null || commentList.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this product." });
    }
    //console.log(comments);

    return res.status(200).json(commentList);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching comments." });
  }
});

app.post("/comments", fetchUser, async (req, res) => {
  try {
    const productId = req.query.productId; // Get the productId from the URL
    const { commentText } = req.body; // Get the comment text from the request body
    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id)); // Get the user from the request
    console.log(commentText);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User must be logged in to comment." });
    }

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({ message: "Comment text is required." });
    }

    // Use `let` instead of `const` so it can be reassigned
    let product = await CommentTable.findOne({ productId });

    if (!product) {
      // If product doesn't exist, create a new entry
      product = new CommentTable({
        productId,
        comments: [
          {
            userName: user.name,
            comment: commentText,
          },
        ],
      });
    } else {
      // If product exists, push the new comment to the comments array
      product.comments.push({
        userName: user.name,
        comment: commentText,
      });
    }

    // Save the updated product (or new product)
    await product.save();

    res.status(201).json({ message: "Comment added successfully!" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error while adding comment." });
  }
});

app.post("/update-password",(req,res) => {
  const { email, newPassword } = req.body;

  // console.log(email);
  // console.log(newPassword);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.password = newPassword;
      user.save();
      return res.status(200).json({ success:true, message: "Password updated successfully" });
    })
    .catch((error) => {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

