const express = require("express");
const fetchUser = require("../middleware/AuthMiddleware");
const router = express.Router();
const multer = require("multer");
const {
  getNewCollections,
  getPopularInWomen,
  getAllProducts,
  addProduct,
  uploadImage,
  removeProduct,
} = require("../controllers/ProductController");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// product

router.post("/upload", upload.single("product"), uploadImage);
router.post("/addProduct", upload.single("product"), addProduct);
router.get("/allProducts", getAllProducts);
router.post("/removeProduct", removeProduct);
router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);


// auth

const { signup, login,updatePassword,verifyEmailSignup,verifyEmail,clientDetails,adminLogin,adminSignup } = require("../controllers/AuthController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/Adminsignup", adminSignup);
router.post("/Adminlogin", adminLogin);
router.post("/update-password", updatePassword);
router.post("/verify-email", verifyEmail);
router.post("/verify-email-signup", verifyEmailSignup);
router.post("/clientDetails" , fetchUser, clientDetails);

// cart

const { checkStock,checkStockInCart,addToCart, removeFromCart, getCartItems,totalCartItems,updateStock } = require("../controllers/CartController");

router.post("/addtocart", fetchUser, addToCart);
router.post("/removefromcart", fetchUser, removeFromCart);
router.get("/cart", fetchUser, getCartItems);
router.post("/totalcartitems",fetchUser,totalCartItems);
router.get("/checkStock/:productId", checkStock);
router.post("/checkStockInCart", checkStockInCart);
router.post("/updateStock", updateStock);

//checkout

const { checkoutSession, buyNow,checkPaymentStatusWithSessionId } = require("../controllers/CheckoutController");


router.post("/create-checkout-session", checkoutSession);
router.post("/buy-now-checkout", buyNow);
router.get("/check-payment-status/:sessionId",checkPaymentStatusWithSessionId);

//comments

const { getComments, addComment } = require("../controllers/CommentController");

router.get("/comments", getComments); // GET /api/comments?productId=123
router.post("/comments", fetchUser, addComment); // POST /api/comments?productId=123


// order
const { getOrderHistory,addOrder } = require("../controllers/OrderController");


router.post("/addOrder", fetchUser, addOrder);
router.get("/orderHistory",fetchUser, getOrderHistory);


module.exports = router;
