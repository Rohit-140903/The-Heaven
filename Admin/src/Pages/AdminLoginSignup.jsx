// 679335090002ecca92ef

import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./AdminLoginSignup.css";
import { Client, Account, ID } from "appwrite";

const client = new Client()
  .setEndpoint(String(import.meta.env.VITE_APPWRITE_ENDPOINT)) // Replace with your Appwrite endpoint
  .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID)); // Replace with your Appwrite Project ID

const account = new Account(client);

function AdminLoginSignup() {
  const [state, setState] = useState("Login");
  const [sideBarStatus, setSideBarStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const login = async () => {
    let responseData;
    await fetch("http://localhost:4000/Adminlogin", {
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
      localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); // auth-token is key name of the token value
      setSideBarStatus(true); // Show sidebar
      // After successful signup, trigger Appwrite Magic URL
      sendMagicLink();
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    //console.log("Sign Up Function Executed Successfully", formData);
    let responseData;
    await fetch("http://localhost:4000/Adminsignup", {
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
      localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); // auth-token is key name of the token value
      setSideBarStatus(true); // Show sidebar
      // After successful signup, trigger Appwrite Magic URL
      sendMagicLink();
    } else {
      alert(responseData.errors);
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendMagicLink = async () => {
    try {
      // alert("Magic URL sent! Please check your email.");
      const response = await account.createMagicURLToken(
        ID.unique(), // Generate a unique ID for the magic URL
        formData.email, // Email address for the magic URL
        "http://localhost:1776" // Redirect to the home route
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />
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
    </div>
  );
}

export default AdminLoginSignup;
