// // NOT USEFUL*****


// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Account, Client } from "appwrite";
// import './CSS/VerifyEmail.css';  // Make sure to import the CSS file

// const VerifyEmail = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const client = new Client().setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
//   const account = new Account(client);

//   // useEffect(() => {
//   //   const urlParams = new URLSearchParams(window.location.search);
//   //   const secret = urlParams.get('secret');
//   //   const userId = urlParams.get('userId');

//   //   const promise = account.updateVerification(userId, secret);

//   //   promise
//   //   .then(function (response) {
//   //       console.log(response);
//   //       localStorage.setItem('auth-token',secret);
//   //       setLoading(false);
//   //       window.location.reload();
//   //       navigate("/mens", { replace: true }); // Success
//   //       window.location.href('/');

//   //   }, function (error) {
//   //       console.log(error); // Failure
//   //       setLoading(false);
//   //   });

//   //   // Verify email using the secret (Magic URL)
//   //   // account.createMagicURLToken(secret)  // Adjusted method to handle the verification.
//   //   //   .then(() => {
//   //   //     // Store the token in localStorage upon successful email verification
//   //   //     localStorage.setItem("auth-token", secret);
//   //   //     setLoading(false);
//   //   //     navigate("/"); // Redirect to another page after verification
//   //   //   })
//   //   //   .catch((err) => {
//   //   //     console.error(err);
//   //   //     setError("Failed to verify email. Please try again.");
//   //   //     setLoading(false);
//   //   //   });
//   // }, [location,navigate]);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const userId = urlParams.get("userId");
//     const secret = urlParams.get("secret");

//     if (!userId || !secret) {
//       setError("Invalid or expired Magic URL");
//       setLoading(false);
//       return;
//     }

//     // Verify the session with Appwrite
//     account.updateMagicURLSession(userId, secret)
//       .then((session) => {
//         // ✅ Store session token after verification
//         localStorage.setItem("auth-token", session.$id);

//         setLoading(false);
//         navigate("/"); // Redirect to home
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Failed to verify email. Please try again.");
//         setLoading(false);
//       });
//   }, [location, navigate]);

//   if (loading) return <div className="spinner"></div>;

//   return (
//     <div className="verify-email-container">
//       {/* {error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <p className="success-message">Email Verified Successfully!</p>
//       )} */}
//     </div>
//   );
// };

// export default VerifyEmail;

// NOT USEFUL*****

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Account, Client } from "appwrite";
import "./CSS/VerifyEmail.css";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const account = new Account(client);

  useEffect(() => {
    const verifyEmail = async () => {
      // const urlParams = new URLSearchParams(location.search);
      // const userId = urlParams.get("userId");
      // const secret = urlParams.get("secret");

      // if (!userId || !secret) {
      //   setError("Invalid or expired Magic URL");
      //   setLoading(false);
      //   return;
      // }

      try {
        // ✅ Create session from Magic URL
        //const session = await account.updateMagicURLSession(userId, secret);

        // // ✅ Store session token in localStorage
        // localStorage.setItem("auth-token", session.$id);

        // ✅ Retrieve tempUser from localStorage
        const tempUserData = localStorage.getItem("tempUser");

        if (tempUserData) {
          try {
            const parsedData = JSON.parse(tempUserData);
            let responseData;

            console.log("Parsed tempUser data:", parsedData);

            // Send user data to backend to finalize account creation
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                //Authorization: `Bearer ${session.$id}`, // Pass token for security
              },
              body: JSON.stringify(parsedData),
            })
              .then((res) => res.json())
              .then((data) => {
                responseData = data;
                console.log("responseData", responseData);
              });

            // ✅ Remove tempUser once saved
            localStorage.removeItem("tempUser");
            localStorage.setItem("auth-token", responseData.token); // Store token from backend response
          } catch (err) {
            console.error("Failed to send temp user data:", err);
          }
        }

        setLoading(false);
        navigate("/"); // Redirect to home
      } catch (err) {
        console.error(err);
        setError("Failed to verify email. Please try again.");
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="verify-email-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="success-message">
          Email Verified Successfully! Redirecting...
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
