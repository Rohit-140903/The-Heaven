const {User,TempUser} = require("../models/UserModel");
const Product = require("../models/ProductModel");

exports.totalCartItems = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if(userData === null) res.json(null);
    res.json(userData.cartData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

exports.checkStockInCart = async (req,res) =>{
  try {
     console.log("Received Request Body:", req.body);

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

     console.log("Final Stock Status:", stockStatus);

    return res.json({ success: true, stockStatus });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkStock = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
    res.json({ success: true, stockStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
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
      { stock: newStock },
      { new: true }
    );

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
};



exports.removeFromCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
      // await userData.save();
    }
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ success: true, cart: userData.cartData });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    let cartItems = userData.cartData;
    let items = [];

    for (let key in cartItems) {
      if (cartItems[key] > 0) {
        let product = await Product.findById(key);
        items.push({ product, quantity: cartItems[key] });
      }
    }

    res.send(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};
