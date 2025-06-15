const express = require("express");
// const { addToCart, removeFromCart, getCartItems,totalCartItems,checkStockInCart } = require("../controllers/CartController");
const fetchUser = require("../middleware/AuthMiddleware");


const { checkStock,checkStockInCart,addToCart, removeFromCart, getCartItems,totalCartItems,updateStock } = require("../controllers/CartController");
const router = express.Router();
router.post("/addtocart", fetchUser, addToCart);
router.post("/removefromcart", fetchUser, removeFromCart);
router.get("/cart", fetchUser, getCartItems);
router.post("/totalcartitems",fetchUser,totalCartItems);
router.get("/checkStock/:productId", checkStock);
router.post("/checkStockInCart", checkStockInCart);
router.post("/updateStock", updateStock);
module.exports = router;
