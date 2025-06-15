

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Client, Account } from "appwrite";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollection from "../Components/NewCollection/NewCollection";
import NewLetter from "../Components/NewLetter/NewLetter";

function Shop() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const account = new Account(client);

  const verifyMagicURL = async (userId, secret) => {
    setLoading(true);
    setError(null);

    console.log("Attempting to verify magic URL...");
    console.log("User ID:", userId);
    console.log("Secret:", secret);

    if (!userId || !secret) {
      console.error("Missing userId or secret in URL parameters.");
      setError("Invalid or expired Magic URL.");
      setLoading(false);
      return;
    }

    try {
      let session;
      try {
        session = await account.get();
        console.log("Current session:", session);
        await account.deleteSession("current");
        console.log("Deleted existing session.");
      } catch (err) {
        console.warn("No active session found. Proceeding with magic URL login.");
      }

      // Call Appwrite's magic URL session update
      console.log("Updating magic URL session...");
      await account.updateMagicURLSession(userId, secret);

      // Get the new session
      session = await account.get();
      console.log("New session:", session);

      // Send user data to backend
      console.log("Sending session email to backend...");
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.email }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data?.success) {
        console.log("Token received:", data.token);
        localStorage.setItem("auth-token", data.token);
      } else {
        setError("Failed to generate token. Please try again.");
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setError(err.message || "Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    console.log("Extracted userId:", userId);
    console.log("Extracted secret:", secret);

    if (!userId || !secret) {
      setError("Invalid or expired Magic URL");
      setLoading(false);
      return;
    }

    verifyMagicURL(userId, secret);
  }, [location]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Popular />
      <Offers />
      <NewCollection />
      <NewLetter />
    </div>
  );
}

export default Shop;

