const Product = require("../models/ProductModel");
const cloudinary = require("../config/CloudinaryConfig");
const fs = require("fs");
const mongoose = require("mongoose");

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to upload to Cloudinary" });
      }
  
      //Get the URL of the uploaded image
      const imageUrl = result.secure_url;
  
      //  Delete the file from the local machine
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file from local storage:", err);
        } else {
          console.log("File deleted from local storage.");
        }
      });
  
      //console.log(imageUrl);
  
      //  Send response back to frontend with the image URL
      res.json({
        success: true,
        message: "File uploaded and deleted from local storage",
        imageUrl,
        imagePublicId: result.public_id, // Include public_id
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload to Cloudinary." });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  if (!req.body.image) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }

  // Upload to Cloudinary
  cloudinary.uploader.upload(req.body.image, async (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload to Cloudinary." });
    }
    // Create a new product with Cloudinary image URL and public ID
    const {
      name,
      category,
      image,
      new_price,
      old_price,
      image_public_id,
      stock,
    } = req.body;
    const count = await Product.countDocuments();
    const newProduct = new Product({
      id: count + 1,
      name,
      image: image, // Use Cloudinary image URL
      image_public_id: image_public_id, // Use Cloudinary public ID
      category,
      new_price,
      old_price,
      stock,
    });

    //  Save the product to the database
    try {
      await newProduct.save();
      res.json({ success: true, message: "Product added successfully!" });
      // console.log(newProduct);
    } catch (error) {
      res.json({ success: false, message: error.message });
    }

    // Delete the file from the local machine after upload
    fs.unlink(req.body.image, (err) => {
      if (err) {
        console.error("Error deleting file from local storage:", err);
      }
    });
  });
};

// Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

// Remove product
exports.removeProduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required.",
    });
  }

  try {
    let product;

    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ image_public_id: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Delete product image from Cloudinary
    await cloudinary.uploader.destroy(product.image_public_id);

    res.json({
      success: true,
      message: `Product "${product.name}" has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product.",
    });
  }
};

// exports.checkStockInCart = async (req,res) =>{
//   try {
//     // console.log("Received Request Body:", req.body);

//     const { products: productQuantities } = req.body; // Expecting an object { productId: desiredQuantity }
//     if (!productQuantities || typeof productQuantities !== "object") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid productQuantities format" });
//     }

//     const productIds = Object.keys(productQuantities);
//     // console.log("Fetching Stock for Product IDs:", productIds);

//     const products = await Product.find({
//       id: { $in: productIds.map(Number) },
//     });

//     // console.log("Fetched Products:", products);

//     const stockStatus = productIds.reduce((acc, id) => {
//       const product = products.find((p) => p.id === Number(id));
//       acc[id] = product ? product.stock >= productQuantities[id] : false; // Ensure stock meets demand
//       return acc;
//     }, {});

//     // console.log("Final Stock Status:", stockStatus);

//     res.json({ success: true, stockStatus });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.checkStock = async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const product = await Product.findOne({ id: productId });
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found." });
//     }

//     const stockStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
//     res.json({ success: true, stockStatus });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update stock
// exports.updateStock = async (req, res) => {
//   const { name, stock } = req.body;
//   const updatedStock = Number(stock);

//   if (!name || isNaN(updatedStock)) {
//     return res.status(400).json({
//       success: false,
//       message: "Product name and updated stock are required.",
//     });
//   }

//   try {
//     const product = await Product.findOne({ name });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found.",
//       });
//     }

//     // Ensure stock never goes below 0
//     const newStock = Math.max(0, product.stock + updatedStock);

//     const updatedProduct = await Product.findOneAndUpdate(
//       { name },
//       { stock: newStock },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: `Stock for product "${name}" updated successfully!`,
//       updatedStock: updatedProduct.stock,
//     });
//   } catch (error) {
//     console.error("Error updating stock:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the stock.",
//     });
//   }
// };

exports.getNewCollections = async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(-8);
    res.send(newCollection);
  };
  
  exports.getPopularInWomen = async (req, res) => {
    let products = await Product.find({ category: "women" });
    console.log(products);
    let popularInWomen = products.slice(0, 4);
    res.send(popularInWomen);
  };

