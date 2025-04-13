const express = require("express");
const { checkoutSession, buyNow,checkPaymentStatusWithSessionId } = require("../controllers/CheckoutController");

const router = express.Router();

router.post("/checkout-session", checkoutSession);
router.post("/buy-now", buyNow);
router.get("/check-payment-status/:sessionId",checkPaymentStatusWithSessionId);

module.exports = router;
