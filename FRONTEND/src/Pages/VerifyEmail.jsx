// NOT USEFUL*****
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Account, Client } from "appwrite";
import './CSS/VerifyEmail.css';  // Make sure to import the CSS file

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const client = new Client().setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const account = new Account(client);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const secret = urlParams.get('secret');
  //   const userId = urlParams.get('userId');
    
  //   const promise = account.updateVerification(userId, secret);
    
  //   promise
  //   .then(function (response) {
  //       console.log(response);
  //       localStorage.setItem('auth-token',secret);
  //       setLoading(false);
  //       window.location.reload();
  //       navigate("/mens", { replace: true }); // Success
  //       window.location.href('/');
       
  //   }, function (error) {
  //       console.log(error); // Failure
  //       setLoading(false);
  //   });

  //   // Verify email using the secret (Magic URL)
  //   // account.createMagicURLToken(secret)  // Adjusted method to handle the verification.
  //   //   .then(() => {
  //   //     // Store the token in localStorage upon successful email verification
  //   //     localStorage.setItem("auth-token", secret);
  //   //     setLoading(false);
  //   //     navigate("/"); // Redirect to another page after verification
  //   //   })
  //   //   .catch((err) => {
  //   //     console.error(err);
  //   //     setError("Failed to verify email. Please try again.");
  //   //     setLoading(false);
  //   //   });
  // }, [location,navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");
  
    if (!userId || !secret) {
      setError("Invalid or expired Magic URL");
      setLoading(false);
      return;
    }
  
    // Verify the session with Appwrite
    account.updateMagicURLSession(userId, secret)
      .then((session) => {
        // ✅ Store session token after verification
        localStorage.setItem("auth-token", session.$id);
  
        setLoading(false);
        navigate("/"); // Redirect to home
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to verify email. Please try again.");
        setLoading(false);
      });
  }, [location, navigate]);
  

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="verify-email-container">
      {/* {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="success-message">Email Verified Successfully!</p>
      )} */}
    </div>
  );
};

export default VerifyEmail;
