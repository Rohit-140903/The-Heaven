const express = require("express");
const { getOrderHistory,addOrder } = require("../controllers/OrderController");
const { fetchUser } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/addOrder", fetchUser, addOrder);
router.get("/orderHistory",fetchUser, getOrderHistory);

module.exports = router;
