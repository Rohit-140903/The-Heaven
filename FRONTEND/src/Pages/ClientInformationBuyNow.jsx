import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";
import "./CSS/ClientInformation.css";
import { Truck } from "lucide-react";


 function AddressPageBuyNow() {
  const { state } = useLocation();
  const { product } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
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
  }, []);

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

  const buyNow = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0 });
   // console.log(product);

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Save address to the database first
      // const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN) || {};
      // console.log(token);
      
      // const userEmail = user.email;
      // console.log(userEmail);
      setLoading(true);
      const saveAddressResponse = await fetch(
        "http://localhost:4000/clientDetails",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "auth-token": `${localStorage.getItem("auth-token")}`,
           },
          body: JSON.stringify({ address : address }),
        }
      );

      if (!saveAddressResponse.ok) {
        throw new Error("Failed to save address.");
      }

      localStorage.setItem("shippingAddress", JSON.stringify(address)); // Store in local storage as well as shippind address key name

      const stripe = await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
      const body = {
        id: product.id,
        name: product.name,
        new_price: product.new_price,
        image : product.image,
        quantity: 1,
      };

      const headers = { "Content-Type": "application/json" };

      setLoading(true);

      const response = await fetch("http://localhost:4000/buy-now-checkout", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

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
      setLoading(false); // Stop loading spinner
    }
  };

  //previous one
  // return (
  //   <div
  //     style={{
  //       maxWidth: "400px",
  //       margin: "auto",
  //       padding: "20px",
  //       border: "1px solid #ccc",
  //       borderRadius: "10px",
  //     }}
  //   >
  //     <h2>Shipping Address</h2>
  //     <form>
  //       <div>
  //         <label>Full Name</label>
  //         <input
  //           type="text"
  //           name="fullName"
  //           value={address.fullName}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.fullName && (
  //           <span style={{ color: "red" }}>{errors.fullName}</span>
  //         )}
  //       </div>

  //       <div>
  //         <label>Phone Number</label>
  //         <input
  //           type="text"
  //           name="phone"
  //           value={address.phone}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}
  //       </div>

  //       <div>
  //         <label>Street Address</label>
  //         <input
  //           type="text"
  //           name="street"
  //           value={address.street}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.street && (
  //           <span style={{ color: "red" }}>{errors.street}</span>
  //         )}
  //       </div>

  //       <div>
  //         <label>City</label>
  //         <input
  //           type="text"
  //           name="city"
  //           value={address.city}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.city && <span style={{ color: "red" }}>{errors.city}</span>}
  //       </div>

  //       <div>
  //         <label>State</label>
  //         <input
  //           type="text"
  //           name="state"
  //           value={address.state}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.state && <span style={{ color: "red" }}>{errors.state}</span>}
  //       </div>

  //       <div>
  //         <label>ZIP Code</label>
  //         <input
  //           type="text"
  //           name="zip"
  //           value={address.zip}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.zip && <span style={{ color: "red" }}>{errors.zip}</span>}
  //       </div>

  //       <div>
  //         <label>Country</label>
  //         <input
  //           type="text"
  //           name="country"
  //           value={address.country}
  //           onChange={handleChange}
  //           required
  //         />
  //         {errors.country && (
  //           <span style={{ color: "red" }}>{errors.country}</span>
  //         )}
  //       </div>

  //       <button onClick={buyNow}>Proceed to Payment</button>
  //     </form>
  //   </div>
  // );

  // later one
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
      <form>
        <div id="formContainer">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && (
              <span style={{ color: "red" }}>{errors.fullName}</span>
            )}
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.phone}</span>
            )}
          </div>

          <div>
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
            {errors.street && (
              <span style={{ color: "red" }}>{errors.street}</span>
            )}
          </div>

          <div id="addContainer">
            <div>
              <label htmlForfor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
              />
              {errors.city && (
                <span style={{ color: "red" }}>{errors.city}</span>
              )}
            </div>

            <div>
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={address.state}
                onChange={handleChange}
                required
              />
              {errors.state && (
                <span style={{ color: "red" }}>{errors.state}</span>
              )}
            </div>

            <div>
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={address.zip}
                onChange={handleChange}
                required
              />
              {errors.zip && <span style={{ color: "red" }}>{errors.zip}</span>}
            </div>

            <div>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleChange}
                required
              />
              {errors.country && (
                <span style={{ color: "red" }}>{errors.country}</span>
              )}
            </div>
          </div>
        </div>

        <button className="pay-button" onClick={buyNow}>
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
export default  AddressPageBuyNow;
