const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getNewCollections,
  getPopularInWomen,
  checkStockInCart,
  updateStock,
  getAllProducts,
  addProduct,
  uploadImage,
  checkStock,
} = require("../controllers/ProductController");
const fetchUser = require("../middleware/fetchUser");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("product"), uploadImage);
router.post("/addProduct", upload.single("product"), addProduct);
router.get("/allProducts", getAllProducts);
router.post("/removeProduct", removeProduct);
router.post("/updateStock", updateStock);
router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);
router.get("/checkStock/:productId", checkStock);
router.get("/checkStockInCart", checkStockInCart);

module.exports = router;
