

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./CSS/Login.css";
import { Client, Account } from "appwrite";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const account = new Account(client);

  const handleForgotPassword = async () => {
    // if(formData.email === ""){
    //   alert("Please enter your email address which is link with this site!")
    //   return;
    // }
    // try {
    //   await account.createRecovery(
    //     formData.email,
    //     "http://localhost:5173/reset-password"
    //   );
    //   alert("Password reset link sent to your email.");
    // } catch (error) {
    //   alert(error.message+" !");
    //   console.error("Error sending reset link:", error.message);
    // }

    navigate('/reset-password');
  };

  const validateEmail = (email) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
    if (!regex.test(email)) {
      setError((prev) => ({
        ...prev,
        email:
          "Please enter a valid email with a supported domain (gmail.com, yahoo.com, etc.)",
      }));
      return false;
    }
    setError((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const login = async () => {
    if (!validateEmail(formData.email)) return;

    setLoading(true);

    let responseData;
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data))
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setError((prev) => ({
          ...prev,
          password: "Login failed. Please try again.",
        }));
      });

    if (responseData?.success) {
      localStorage.setItem(
        String(import.meta.env.VITE_AUTH_TOKEN),
        responseData.token
      );
      navigate("/");
      window.location.reload();
    } else {
      setLoading(false);
      setError((prev) => ({
        ...prev,
        password: "Wrong password or email. Please try again.",
      }));
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Login</h1>
        <div className="login-fields">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email Address"
          />
          {error.email && <p style={{ color: "red" }}>{error.email}</p>}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
          />
          <div className="toggle-login">
            {showPassword ? (
              <BsEyeSlash onClick={togglePassword} />
            ) : (
              <BsEye onClick={togglePassword} />
            )}
          </div>
          {error.password && <p style={{ color: "red" }}>{error.password}</p>}
          <p
            onClick={handleForgotPassword}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Forgot Password?
          </p>
        </div>

        {/* Loading Spinner Overlay */}
        {/* {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )} */}

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Login;
