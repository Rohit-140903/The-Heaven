import React, { useState, useEffect } from "react";
import "./UpdateStock.css";
import { useNavigate } from "react-router-dom";

export default function UpdateStock() {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(String(import.meta.env.VITE_AUTH_TOKEN));
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/Adminlogin")
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      
      return null;
    }

    if (!productName || !stock) {
      alert("Please enter product name and stock quantity.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/updateStock", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: productName, stock: Number(stock) }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Stock updated successfully!");
        setProductName("");
        setStock("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-stock">
      <form onSubmit={handleSubmit}>
        <div className="update-stock-field">
          <label>Product Name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="update-stock-field">
          <label>Stock Quantity</label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <button type="submit" className="update-stock-btn" disabled={loading}>
          {loading ? "Updating..." : "UPDATE"}
        </button>
      </form>
    </div>
  );
}
