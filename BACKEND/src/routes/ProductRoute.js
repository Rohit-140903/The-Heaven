const express = require("express");
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
const fetchUser = require("../middleware/AuthMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("product"), uploadImage);
router.post("/addProduct", upload.single("product"), addProduct);
router.get("/allProducts", getAllProducts);
router.post("/removeProduct", removeProduct);

router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);

module.exports = router;
