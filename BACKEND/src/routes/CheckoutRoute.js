const express = require("express");
const { checkoutSession, buyNow,checkPaymentStatusWithSessionId } = require("../controllers/CheckoutController");
const fetchUser = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/create-checkout-session", fetchUser,checkoutSession);
router.post("/buy-now-checkout",fetchUser, buyNow);
router.get("/check-payment-status/:sessionId",fetchUser,checkPaymentStatusWithSessionId);

module.exports = router;
