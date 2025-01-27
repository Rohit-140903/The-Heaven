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
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("product"), (req, res) => {
 //Upload to Cloudinary
  cloudinary.uploader.upload(req.file.path, async (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Failed to upload to Cloudinary" });
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
      imagePublicId: result.public_id,  // Include public_id
    });
  });
});

// Schema for creating Products
const Product = mongoose.model("Product", {
  id : {
    type : Number,
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
});

app.post("/addProduct", upload.single("product"), async (req, res) => {
  console.log(req.body.image);
  if (!req.body.image) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  // Upload to Cloudinary
  cloudinary.uploader.upload(req.body.image, async (error, result) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Failed to upload to Cloudinary." });
    }
// Create a new product with Cloudinary image URL and public ID
    const { name, category, image,new_price, old_price,image_public_id } = req.body;
    const count = await Product.countDocuments();
    const newProduct = new Product({
      id : count+1,
      name,
      image: image,  // Use Cloudinary image URL
      image_public_id: image_public_id,  // Use Cloudinary public ID
      category,
      new_price,
      old_price,
    });

    //  Save the product to the database
    try {
      await newProduct.save();
      res.json({ success: true, message: "Product added successfully!" });
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
  }
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

app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await newUser.save();

  const data = {
    user: {
      id: newUser.id,
    },
  };

  const token = jwt.sign(data, process.env.SALT_KEY); // salting
  res.json({ success: true, token });
});

app.post("/Adminsignup", async (req, res) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount >= 1) {
    return res.status(400).json({
      success: false,
      errors: "Admin Access Window Size Exceed",
    });
  }

  let check = await Admin.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  }

  const newAdmin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await newAdmin.save();

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
  res.json(userData.cartData);
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
        // images: [item.image]  // because stripe doesn't access private url for that we have to use public clouds
      },
      unit_amount: Math.round(item.new_price * 100),
    },
    quantity: cartItems[item.id],
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/failure",
  });

  res.json({ id: session.id });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
