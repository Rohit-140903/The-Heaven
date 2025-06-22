const express = require("express");
const { getOrderHistory,addOrder,sendMailToUser,findAllOrders,updateOrderDetails } = require("../controllers/OrderController");
const fetchUser= require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/addOrder", fetchUser, addOrder);
router.get("/orderHistory",fetchUser, getOrderHistory);
router.post("/sendMail",sendMailToUser);
router.get("/allOrders",findAllOrders);
router.patch("/updateOrder",updateOrderDetails);

module.exports = router;
