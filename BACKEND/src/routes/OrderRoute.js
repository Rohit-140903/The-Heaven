const express = require("express");
const { getOrderHistory,addOrder,sendMailToUser,findAllOrders } = require("../controllers/OrderController");
const fetchUser= require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/addOrder", fetchUser, addOrder);
router.get("/orderHistory",fetchUser, getOrderHistory);
router.post("/sendMail",sendMailToUser);
router.get("/allOrders",findAllOrders);

module.exports = router;
