

import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { ShopContext } from "../Context/ShopContext";
import { Truck } from "lucide-react";

import "./CSS/ClientInformation.css";

export default function AddressPageCheckout() {
  window.scrollTo({ top: 0 });
  const navigate = useNavigate();
  const { state } = useLocation();
  const { stockStatus } = state;
  const [loading, setLoading] = useState(true);

  const {
    all_product,
    cartItems,
  } = useContext(ShopContext);

  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    return savedAddress
      ? JSON.parse(savedAddress)
      : {
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        };
  });

  const RESERVATION_TIME = 30;
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_TIME);
  const [timerExpired, setTimerExpired] = useState(false);

  const handleChange = (e) => {
    const updatedAddress = { ...address, [e.target.name]: e.target.value };
    setAddress(updatedAddress);
    localStorage.setItem("shippingAddress", JSON.stringify(updatedAddress));
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setTimerExpired(true);
      alert("Your reservation has expired. Redirecting to home page.");
      navigate("/");
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, navigate]);

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let tempErrors = {};
    if (!address.fullName) tempErrors.fullName = "Full Name is required";
    if (!address.phone.match(/^\d{10}$/))
      tempErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.street) tempErrors.street = "Street Address is required";
    if (!address.city) tempErrors.city = "City is required";
    if (!address.state) tempErrors.state = "State is required";
    if (!address.zip.match(/^\d{6}$/))
      tempErrors.zip = "Enter a valid 6-digit ZIP code";
    if (!address.country) tempErrors.country = "Country is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const makePayment = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0 });

    if (timerExpired) {
      alert("Reservation expired. Please start your order again.");
      navigate("/");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const user = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN);
      const userEmail = user?.email;
      await fetch("http://localhost:4000/api/clientDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, address }),
      });

      const stripe = await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

      const inStockProducts = Object.keys(cartItems)
        .filter((id) => stockStatus[id])
        .map((id) => ({
          id,
          quantity: cartItems[id],
          details: all_product.find((product) => String(product.id) === id),
        }));

      const totalAmount = inStockProducts.reduce(
        (sum, item) => sum + item.details.new_price * item.quantity,
        0
      );

      const updatedProduct = inStockProducts.map((item) => item.details);

      const body = {
        products: updatedProduct,
        total_amount: totalAmount,
        quantity: inStockProducts.reduce((acc, item) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {}),
      };

      const response = await fetch(
        "http://localhost:4000/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create checkout session."
        );
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <h2 id="shipping">
        <Truck style={{ paddingRight: "15px", transform: "translateY(3px)" }} />
        Shipping Address
      </h2>

      <p style={{ fontWeight: "bold", fontSize: "18px", color: timerExpired ? "red" : "black" }}>
        Reservation expires in: {formatTimer(secondsLeft)}
      </p>

      <form>
        <div id="formContainer">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" name="fullName" value={address.fullName} onChange={handleChange} required />
            {errors.fullName && <span style={{ color: "red" }}>{errors.fullName}</span>}
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <input type="text" name="phone" value={address.phone} onChange={handleChange} required />
            {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}
          </div>
          <div>
            <label htmlFor="street">Street Address</label>
            <input type="text" name="street" value={address.street} onChange={handleChange} required />
            {errors.street && <span style={{ color: "red" }}>{errors.street}</span>}
          </div>

          <div id="addContainer">
            <div>
              <label htmlFor="city">City</label>
              <input type="text" name="city" value={address.city} onChange={handleChange} required />
              {errors.city && <span style={{ color: "red" }}>{errors.city}</span>}
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input type="text" name="state" value={address.state} onChange={handleChange} required />
              {errors.state && <span style={{ color: "red" }}>{errors.state}</span>}
            </div>
            <div>
              <label htmlFor="zip">ZIP Code</label>
              <input type="text" name="zip" value={address.zip} onChange={handleChange} required />
              {errors.zip && <span style={{ color: "red" }}>{errors.zip}</span>}
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input type="text" name="country" value={address.country} onChange={handleChange} required />
              {errors.country && <span style={{ color: "red" }}>{errors.country}</span>}
            </div>
          </div>
        </div>

        <button className="pay-button" onClick={makePayment}>
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
