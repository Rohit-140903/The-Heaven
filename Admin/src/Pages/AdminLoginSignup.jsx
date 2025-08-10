
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Client, Account, ID } from "appwrite";
import { BsEye,BsEyeSlash } from "react-icons/bs";
import "./AdminLoginSignup.css";


function AdminLoginSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const client = new Client()
  .setEndpoint(String(import.meta.env.VITE_APPWRITE_ENDPOINT))
  .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID));

const account = new Account(client);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state

  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailParts = email.split("@");

    if (emailParts.length !== 2) {
      setError("Enter a valid email address");
      return false;
    }

    const domain = emailParts[1];
    const validDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];

    if (!validDomains.includes(domain)) {
      setError("Enter a valid email domain (e.g., gmail.com, yahoo.com)");
      return false;
    }

    setError(""); // Clear any previous error
    return true;
  };

  const login = async () => {
    if (!validateEmail(formData.email)) return; // Validate email before proceeding

    setLoading(true); // Start loading spinner

    let responseData;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Adminlogin`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem(
        String(import.meta.env.VITE_AUTH_TOKEN),
        responseData.token
      ); // auth-token is key name of the token value
      setLoading(true);
      navigate('/');
    } else {
      alert(responseData.errors);
    }

    setLoading(false); // Stop loading spinner
  };

  const signup = async () => {
    if (!validateEmail(formData.email)) return; // Validate email before proceeding

    setLoading(true); // Start loading spinner

    let responseData;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-email-signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      sendMagicLink();
    } else {
      alert(responseData.errors);
    }

    setLoading(false); // Stop loading spinner
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // adminsignup calls from home.jsx

  const sendMagicLink = async () => {
    try {
      const response = await account.createMagicURLToken(
        ID.unique(), // Generate a unique ID for the magic URL
        formData.email, // Email address for the magic URL
        "https://the-heaven-tvd6.vercel.app/" // Redirect to the home route
      );
      alert("Magic URL sent! Please check your email.");
    } catch (err) {
      console.error(err);
      alert("Failed to send magic URL.");
    }
  };

  return (
    <div className="Adminloginsignup">
      <div className="Adminloginsignup-container">
        <h1>{state}</h1>
        <div className="Adminloginsignup-fields">
          {state === "Sign Up" ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              placeholder="Your Name"
            />
          ) : null}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email Address"
          />
          {error && (
            <p style={{ color: "red", fontSize: "17px", marginTop: "-20px" }}>
              {error}
            </p>
          )}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Password"
            />
            <div className="admin-toggle">
              {showPassword ? 
                <BsEyeSlash onClick={togglePasswordVisibility} />
               : 
               <BsEye onClick={togglePasswordVisibility} /> }
            </div>
          </div>
        </div>
        <button onClick={() => (state === "Sign Up" ? signup() : login())}>
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="Adminloginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="Adminloginsignup-login">
            Create an Account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}
        <div className="Adminloginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default AdminLoginSignup;
