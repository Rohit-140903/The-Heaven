import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    stock: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(String(import.meta.env.VITE_AUTH_TOKEN));
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/Adminlogin')
      setIsAuthenticated(false);
    }
  }, []);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const validateProduct = () => {
    if (!productDetails.name || !productDetails.new_price || !productDetails.old_price || !productDetails.stock || !image) {
      alert("Please fill all fields and upload an image.");
      return false;
    }
    return true;
  };

  const Add_Product = async () => {
    if (!validateProduct()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const updatedProductDetails = {
          ...productDetails,
          image: uploadData.imageUrl,
          image_public_id: uploadData.imagePublicId,
        };

        const productResponse = await fetch("http://localhost:4000/api/addProduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProductDetails),
        });
        const productData = await productResponse.json();

        if (productData.success) {
          alert("Product Added Successfully!");
          setProductDetails({
            name: "",
            image: "",
            category: "women",
            new_price: "",
            old_price: "",
            stock: "",
          });
          setImage(null);
        } else {
          alert(productData.message);
        }
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error during image upload or product creation:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) { //Don't render anything
    return null;
  }
  

  return (
    <div className="addproduct">
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Stock Quantity</p>
        <input
          value={productDetails.stock}
          onChange={changeHandler}
          type="number"
          name="stock"
          placeholder="Enter stock quantity"
        />
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="addproduct-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfeild">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt="upload"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn" disabled={loading}>
        {loading ? "Adding..." : "ADD"}
      </button>
    </div>
  );
}
