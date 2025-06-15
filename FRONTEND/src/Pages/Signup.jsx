
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account, ID } from "appwrite";
import { BsEye,BsEyeSlash } from "react-icons/bs";
import "./CSS/Signup.css";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const client = new Client()
    .setEndpoint(String(import.meta.env.VITE_APPWRITE_ENDPOINT))
    .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID));

  const account = new Account(client);

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

  const signup = async () => {
    if (!validateEmail(formData.email)) return;

    setLoading(true);

    let responseData;
    await fetch("http://localhost:4000/api/verify-email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        responseData = data;
        console.log("responseData " , responseData);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setError((prev) => ({
          ...prev,
          password: "Sign-up failed. Please try again.",
        }));
      });

      if(responseData.status === 409){
        console.error("Something wrong Occured Try Again!");
      }
    else if (responseData.success) {
      sendMagicLink();
    } else {
      setLoading(false);
      setError((prev) => ({ ...prev, email: "Email already exists" }));
    }
  };

  const sendMagicLink = async () => {
    try {
      await account.createMagicURLToken(
        ID.unique(),
        formData.email,
        "http://localhost:5173"
      );
      alert("Magic URL sent! Please check your email.");
    } catch (err) {
      console.error(err);
      alert("Failed to send magic URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="signup-container">
        <h1>Sign Up</h1>
        <div className="signup-fields">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your Name"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email Address"
          />
          {error.email && <p className="error-text">{error.email}</p>}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
          />
          <div className = "toggle-btn">
            {showPassword ? <BsEyeSlash onClick={togglePassword}/> : <BsEye onClick={togglePassword}/>}
          </div>
          {error.password && <p className="error-text">{error.password}</p>}

        </div>
        <button onClick={signup} disabled={loading}>
          Sign Up
        </button>
        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log In</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

