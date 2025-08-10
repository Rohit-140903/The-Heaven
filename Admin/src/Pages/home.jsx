// import React from 'react';
//  import './home.css';
// import Sidebar from '../Components/Sidebar/Sidebar';
// import {Routes,Route} from 'react-router-dom';
// import AddProduct from '../Components/AddProduct/AddProduct';
// import ListProduct from '../Components/ListProduct/ListProduct';
// import UpdateStock from '../Components/UpdateStock/UpdateStock';

// const Home = ()=>{
//     return (
//         <div className = "home">
//             <Sidebar />
//             <Routes>
//                 <Route path = '/addProduct' element = {<AddProduct />} />
//                 <Route path = '/listProduct' element = {<ListProduct />} />
//                 <Route path = '/updateStock' element = {<UpdateStock />} />
//             </Routes>
//         </div>
//     )
// }
// export default Home;

import React from "react";
import "./home.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Routes, Route,useLocation } from "react-router-dom";
import AddProduct from "../Components/AddProduct/AddProduct";
import ListProduct from "../Components/ListProduct/ListProduct";
import UpdateStock from "../Components/UpdateStock/UpdateStock";
import { Client, Account, ID } from "appwrite";
import { useState, useEffect } from "react";

import AllOrders from "../Components/AllOrders/AllOrders";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // get current route

  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const account = new Account(client);

  const verifyMagicURL = async (userId, secret) => {
    setLoading(true);
    try {
      // Ensure user is logged in before deleting session
      let session;
      try {
        session = await account.get();
        console.log("Current session:", session);
      } catch (err) {
        console.warn(
          "No active session found, proceeding with magic URL login."
        );
      }

      // Only delete session if one exists
      if (session) {
        await account.deleteSession("current");
      }

      // Proceed with magic URL session update
      await account.updateMagicURLSession(userId, secret);

      // Fetch new session
      session = await account.get();
      let responseData;

      // Fetch the backend to generate token after successful verification
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Adminsignup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.email }), // Send the user's email to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          responseData = data;
          if (responseData?.success) {
            console.log(responseData.token);
            localStorage.setItem("token", responseData.token);
            window.location.reload();
          } else {
            setLoading(false);
            setError("Failed to generate token. Please try again.");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          setError("Sign-up failed. Please try again.");
        });
    } catch (err) {
      console.error(err);
      setError("Failed to verify email. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    console.log("userId ", userId);
    console.log("secret : ", secret);

    if (!userId || !secret) {
      setError("Invalid or expired Magic URL");
      setLoading(false);
      return;
    } else {
      setLoading(true);
      verifyMagicURL(userId, secret);
    }
  }, [location]);
  return (
    <div className="home">
      <Sidebar />
      {location.pathname === "/" ?
        <h1 className="home-txt">
          <span>W</span><span>E</span><span>L</span><span>C</span><span>O</span><span>M</span><span>E</span><span> </span>
          <span>T</span><span>O</span><span> </span>
          <span>A</span><span>D</span><span>M</span><span>I</span><span>N</span><span> </span>
          <span>P</span><span>A</span><span>G</span><span>E</span><span>!</span>
        </h1> : null
      }
      <Routes>
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/listProduct" element={<ListProduct />} />
        <Route path="/updateStock" element={<UpdateStock />} />
        <Route path="/allOrders" element={<AllOrders />} />
      </Routes>
    </div>
  );
};
export default Home;
