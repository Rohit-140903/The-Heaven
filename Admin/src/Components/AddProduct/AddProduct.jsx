import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

export default function AddProduct() {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token is present in localStorage when component mounts
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Set to true if token exists
    } else {
      setIsAuthenticated(false); // Set to false if no token
    }
  }, []);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!isAuthenticated) {
      alert("Please log in first.");
      return; // Stop the function execution if not authenticated
    }

    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image); // Append image to formData

    // Upload the image
    await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          responseData = data;
        } else {
          alert(data.message);
        }
      });

    if (responseData.success) {
      product.image = responseData.image_url;
      await fetch("http://localhost:4000/addProduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Product Added");
            // Reset the form fields
            setProductDetails({
              name: "",
              image: "",
              category: "women",
              new_price: "",
              old_price: "",
            });
            setImage(false);
          } else {
            alert(data.message);
          }
        });
    } else {
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="addproduct">
      {!isAuthenticated && (
        <div className="alert-message">
          <p>You need to be logged in to add a product.</p>
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
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
}
