import React, { useContext, useState, useEffect } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/remove_icon.png";
import { loadStripe } from "@stripe/stripe-js";
import { Trash2, CirclePlus } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function CartItems() {
  const navigate = useNavigate();
  const {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [stockStatus, setStockStatus] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0});
    const checkStockAvailability = async () => {
      const productQuantities = Object.keys(cartItems)
        .filter((id) => cartItems[id] > 0) // Only include selected products
        .reduce((acc, id) => {
          acc[id] = cartItems[id]; // Store product ID as key and quantity as value
          return acc;
        }, {});
      if (productQuantities.length === 0) {
        // setLoading(false);
        return;
      } // Skip API call if cart is empty

      try {
        const response = await fetch("http://localhost:4000/checkStockInCart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: productQuantities }), // Send only selected product IDs
        });

        if (!response.ok) throw new Error("Failed to fetch stock status");

        const data = await response.json();
        setStockStatus(data.stockStatus); // Update stock status in state
        console.log(stockStatus);
      } catch (err) {
        alert("Error checking stock: " + err.message);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    checkStockAvailability();
  }, [cartItems]); // Runs when cart items change



useEffect(() => {
  console.log("Updated stockStatus:", stockStatus);
}, [stockStatus]);

  const giveclientInformation = async () => {
    setLoading(true);
    const token = localStorage.getItem('auth-token');
    if(token === null){
      setLoading(false);
      alert("Not a Valid User, Login First!");
      return;
    }
 
    try {
      const stripe = await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

      // Filter in-stock products
      const inStockProducts = Object.keys(cartItems)
        .filter((id) => stockStatus[id]) // Only include in-stock products
        .map((id) => ({
          id,
          quantity: cartItems[id],
          details: all_product.find((product) => String(product.id) === id),
        }));

      if (inStockProducts.length === 0) {
        alert("No product is to be checkout!");
        setLoading(false);
        return;
      }
      navigate('/ClientInformation' ,{state : {stockStatus} });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cartitems">
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
        <p>Add</p>
      </div>
      <hr />
      {all_product.map((item) => {
        if (cartItems[item.id] > 0) {
          const inStock = stockStatus[item.id]; // Check stock availability
          return (
            <div
              key={item.id}
              className={`cart-item ${inStock ? "" : "out-of-stock"}`}
            >
              <div className="cartitems-format cartitems-format-main">
                <div className="cartitems-image-container">
                  <img
                    src={item.image}
                    alt=""
                    className="carticon-product-icon"
                  />
                  <span
                    className={
                      inStock ? "in-stock-message" : "out-of-stock-message"
                    }
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p>{item.name}</p>
                <p>${item.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[item.id]}
                </button>
                <p>${item.new_price * cartItems[item.id]}</p>
                <Trash2
                  className="cart-icon"
                  onClick={() => removeFromCart(item.id)}
                />
                <CirclePlus
                  className="cart-icon"
                  onClick={() => addToCart(item.id)}
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>
                $
                {all_product.reduce(
                  (sum, item) =>
                    cartItems[item.id] > 0 && stockStatus[item.id]
                      ? sum + item.new_price * cartItems[item.id]
                      : sum,
                  0
                )}
              </p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>
                $
                {all_product.reduce(
                  (sum, item) =>
                    cartItems[item.id] > 0 && stockStatus[item.id]
                      ? sum + item.new_price * cartItems[item.id]
                      : sum,
                  0
                )}
              </h3>
            </div>
          </div>
          <button onClick={giveclientInformation} disabled={loading}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
