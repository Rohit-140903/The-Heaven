

import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";

function ProductDisplay(props) {
  const { product, stockStatus } = props;
  const { addToCart } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const isTokenPresent = () => {
    return localStorage.getItem('auth-token') !== null;
  };

  const addToCartButton = async () =>{
    if (!isTokenPresent()) {
      alert("Not a Valid User, Login First!");
      return;
    }
    console.log(product.id);
    addToCart(product.id);
  };

  const buyNow = async () => {
    if (!isTokenPresent()) {
      alert("Not a Valid User, Login First!");
      return;
    }
    console.log("buy - now", product);
    navigate('/clientInformation-buy-now', { state: { product } });
  };

  const smallImages = [product, product, product, product];

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {smallImages.map((img, index) => (
            <img
              key={index}
              src={img.image}
              alt={`Product image ${img.name}`}
              className="productdisplay-img-thumb"
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={product.image}
            alt="Main product"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, index) => (
            <img key={index} src={star_icon} alt="Star" />
          ))}
          <img src={star_dull_icon} alt="Star" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description || "A lightweight, usually knitted, pullover shirt..."}
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizeVariant">
            {["S", "M", "L", "XL", "XXL"].map((size, index) => (
              <div key={index}>{size}</div>
            ))}
          </div>
        </div>

        <div className="buy-now-container">
          <button
            onClick={buyNow}
            className={`buy-now-button ${!isTokenPresent() || 
              stockStatus !== "In Stock" ? "disabled" : ""}
            `}
          >
            Buy Now
          </button>
        </div>
        <div className="stock-cart-container">
          <button
            onClick={addToCartButton}
            className="add-to-cart-button"
          >
            Add To Cart
          </button>
          <span
            className={`stock-status-message ${
              stockStatus === "In Stock" ? "in-stock" : "out-of-stock"
            }`}
          >
            {stockStatus === "In Stock" ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <p className="productdisplay-right-category">
          <span>Category: </span>
          {product.category || "Unknown"}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags: </span>
          {product.tags?.join(", ") || "None"}
        </p>
      </div>
    </div>
  );
}

export default ProductDisplay;

