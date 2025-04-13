const express = require("express");
const { addToCart, removeFromCart, getCartItems,totalCartItems } = require("../controllers/CartController");
const fetchUser = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/addtocart", fetchUser, addToCart);
router.post("/removefromcart", fetchUser, removeFromCart);
router.get("/cart", fetchUser, getCartItems);
router.post("/totalcartitems",fetchUser,totalCartItems)

module.exports = router;
