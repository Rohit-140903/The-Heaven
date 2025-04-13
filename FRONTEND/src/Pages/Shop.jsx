
// // // import React from "react";
// // // import Hero from "../Components/Hero/Hero";
// // // import Popular from "../Components/Popular/Popular";
// // // import Offers from "../Components/Offers/Offers";
// // // import NewCollection from "../Components/NewCollection/NewCollection";
// // // import NewLetter from "../Components/NewLetter/NewLetter";

// // // function Shop (){
// // //     return(
// // //         <div>
// // //             <Hero/>
// // //             <Popular/>
// // //             <Offers/>
// // //             <NewCollection/>
// // //             <NewLetter/>

// // //         </div>
// // //     )
// // // }

// // // export default Shop

// // import React, { useEffect, useState } from "react";
// // import { useLocation } from "react-router-dom";
// // import { Client, Account } from "appwrite";
// // import Hero from "../Components/Hero/Hero";
// // import Popular from "../Components/Popular/Popular";
// // import Offers from "../Components/Offers/Offers";
// // import NewCollection from "../Components/NewCollection/NewCollection";
// // import NewLetter from "../Components/NewLetter/NewLetter";

// // function Shop() {
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const location = useLocation();

// //   const client = new Client()
// //     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
// //     .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
// //   const account = new Account(client);

// //   const verifyMagicURL = async (userId, secret) => {
// //     setLoading(true);
// //     try{
// //       await account.deleteSession("current");
// //       await account.updateMagicURLSession(userId, secret); // Verifies the user
// //       const session = await account.get(); // Fetch user details
// //       console.log("User email:", session.email);
// //     // Verify the session with Appwrite's Magic URL
// //     // account
// //     //   .updateMagicURLSession(userId, secret)
// //     //   .then((session) => {
// //         // Successfully verified the email and got the session
// //         setLoading(true); // Start the process of token generation
// //         let responseData;

// //         // Fetch the backend to generate token after successful verification
// //         fetch('http://localhost:4000/signup', {
// //           method: 'POST',
// //           headers: {
// //             Accept: 'application/json',
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({ email: session.email }), // Send the user's email to the backend
// //         })
// //           .then((res) => res.json())
// //           .then((data) => {
// //             responseData = data;
// //             if (responseData?.success) {
// //               console.log(responseData.token);
// //               localStorage.setItem("auth-token", responseData.token);
// //             } else {
// //               setLoading(false);
// //               setError("Failed to generate token. Please try again.");
// //             }
// //           })
// //           .catch((err) => {
// //             setLoading(false);
// //             console.error(err);
// //             setError("Sign-up failed. Please try again.");
// //           });
// //       }
// //       catch(err) {
// //         console.error(err);
// //         setError("Failed to verify email. Please try again.");
// //         setLoading(false);
// //       };
// //     }

// //   useEffect(() => {
// //     setLoading(true);
// //     const urlParams = new URLSearchParams(location.search);
// //     const userId = urlParams.get("userId");
// //     const secret = urlParams.get("secret");

// //     console.log("userId ", userId);
// //     console.log("secret : ", secret);

// //     if (!userId || !secret) {
// //       setError("Invalid or expired Magic URL");
// //       setLoading(false);
// //       return;
// //     }

// //     else{
// //       verifyMagicURL(userId,secret);
// //     }

    
// //     // const verifyMagicURL = async (userId, secret) => {
// //     // try{
// //     //   await account.updateMagicURLSession(userId, secret); // Verifies the user
// //     //   const session = await account.get(); // Fetch user details
// //     //   console.log("User email:", session.email);
// //     // // Verify the session with Appwrite's Magic URL
// //     // // account
// //     // //   .updateMagicURLSession(userId, secret)
// //     // //   .then((session) => {
// //     //     // Successfully verified the email and got the session
// //     //     setLoading(true); // Start the process of token generation
// //     //     let responseData;

// //     //     // Fetch the backend to generate token after successful verification
// //     //     fetch('http://localhost:4000/signup', {
// //     //       method: 'POST',
// //     //       headers: {
// //     //         Accept: 'application/json',
// //     //         'Content-Type': 'application/json',
// //     //       },
// //     //       body: JSON.stringify({ email: session.email }), // Send the user's email to the backend
// //     //     })
// //     //       .then((res) => res.json())
// //     //       .then((data) => {
// //     //         responseData = data;
// //     //         if (responseData?.success) {
// //     //           // Store the token in localStorage after receiving the response
// //     //           console.log(responseData.token);
// //     //           localStorage.setItem("auth-token", responseData.token);
// //     //           setLoading(false); // Done with the token generation
// //     //         } else {
// //     //           setLoading(false);
// //     //           setError("Failed to generate token. Please try again.");
// //     //         }
// //     //       })
// //     //       .catch((err) => {
// //     //         setLoading(false);
// //     //         console.error(err);
// //     //         setError("Sign-up failed. Please try again.");
// //     //       });
// //     //   }
// //     //   catch(err) {
// //     //     console.error(err);
// //     //     setError("Failed to verify email. Please try again.");
// //     //     setLoading(false);
// //     //   };
// //     // }
// //   }, [location]);

// //   if (loading) return <div>Loading...</div>;

// //   return (
// //     <div>
// //       {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
// //       <Hero />
// //       <Popular />
// //       <Offers />
// //       <NewCollection />
// //       <NewLetter />
// //     </div>
// //   );
// // }

// // export default Shop;



// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Client, Account } from "appwrite";
// import Hero from "../Components/Hero/Hero";
// import Popular from "../Components/Popular/Popular";
// import Offers from "../Components/Offers/Offers";
// import NewCollection from "../Components/NewCollection/NewCollection";
// import NewLetter from "../Components/NewLetter/NewLetter";

// function Shop() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();

//   const client = new Client()
//     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
//   const account = new Account(client);

//   // const verifyMagicURL = async (userId, secret) => {
//   //   setLoading(true);
//   //   try {
//   //     await account.deleteSession("current");
//   //     await account.updateMagicURLSession(userId, secret);
//   //     const session = await account.get();
//   //     console.log("User email:", session.email);

//   //     let responseData;

//   //     fetch("http://localhost:4000/signup", {
//   //       method: "POST",
//   //       headers: {
//   //         Accept: "application/json",
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ email: session.email }),
//   //     })
//   //       .then((res) => res.json())
//   //       .then((data) => {
//   //         responseData = data;
//   //         if (responseData?.success) {
//   //           console.log(responseData.token);
//   //           localStorage.setItem("auth-token", responseData.token);
//   //         } else {
//   //           setError("Failed to generate token. Please try again.");
//   //         }
//   //       })
//   //       .catch((err) => {
//   //         console.error(err);
//   //         setError("Sign-up failed. Please try again.");
//   //       })
//   //       .finally(() => {
//   //         setLoading(false);
//   //       });
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError("Failed to verify email. Please try again.");
//   //     setLoading(false);
//   //   }
//   // };

//   const verifyMagicURL = async (userId, secret) => {
//     setLoading(true);
//     try {
//       // Ensure user is logged in before deleting session
//       let session;
//       try {
//         session = await account.get();
//         console.log("Current session:", session);
//       } catch (err) {
//         console.warn("No active session found, proceeding with magic URL login.");
//       }
  
//       // Only delete session if one exists
//       if (session) {
//         await account.deleteSession("current");
//       }
  
//       // Proceed with magic URL session update
//       await account.updateMagicURLSession(userId, secret);
  
//       // Fetch new session
//       session = await account.get();
//       //console.log("User email:", session.email);
  
//       // Send user data to backend
//       const response = await fetch("http://localhost:4000/signup", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: session.email }),
//       });
  
//       const data = await response.json();
  
//       if (data?.success) {
//         console.log(data.token);
//         localStorage.setItem("auth-token", data.token);
//       } else {
//         setError("Failed to generate token. Please try again.");
//       }
//     } catch (err) {
//       console.error("Verification failed:", err);
//       setError("Failed to verify email. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     setLoading(true);
//     const urlParams = new URLSearchParams(location.search);
//     const userId = urlParams.get("userId");
//     const secret = urlParams.get("secret");

//     if (!userId || !secret) {
//       setError("Invalid or expired Magic URL");
//       setLoading(false);
//       return;
//     }

//     verifyMagicURL(userId, secret);
//   }, [location]);

//   if (loading) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           background: "rgba(0, 0, 0, 0.3)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 1000,
//         }}
//       >
//         <div
//           style={{
//             width: "50px",
//             height: "50px",
//             border: "4px solid rgba(255, 255, 255, 0.3)",
//             borderTop: "4px solid #fff",
//             borderRadius: "50%",
//             animation: "spin 1s linear infinite",
//           }}
//         ></div>
//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//           `}
//         </style>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Hero />
//       <Popular />
//       <Offers />
//       <NewCollection />
//       <NewLetter />
//     </div>
//   );
// }

// export default Shop;

// // import React from "react";
// // import Hero from "../Components/Hero/Hero";
// // import Popular from "../Components/Popular/Popular";
// // import Offers from "../Components/Offers/Offers";
// // import NewCollection from "../Components/NewCollection/NewCollection";
// // import NewLetter from "../Components/NewLetter/NewLetter";

// // function Shop (){
// //     return(
// //         <div>
// //             <Hero/>
// //             <Popular/>
// //             <Offers/>
// //             <NewCollection/>
// //             <NewLetter/>

// //         </div>
// //     )
// // }

// // export default Shop

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Client, Account } from "appwrite";
// import Hero from "../Components/Hero/Hero";
// import Popular from "../Components/Popular/Popular";
// import Offers from "../Components/Offers/Offers";
// import NewCollection from "../Components/NewCollection/NewCollection";
// import NewLetter from "../Components/NewLetter/NewLetter";

// function Shop() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();

//   const client = new Client()
//     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
//   const account = new Account(client);

//   const verifyMagicURL = async (userId, secret) => {
//     setLoading(true);
//     try{
//       await account.deleteSession("current");
//       await account.updateMagicURLSession(userId, secret); // Verifies the user
//       const session = await account.get(); // Fetch user details
//       console.log("User email:", session.email);
//     // Verify the session with Appwrite's Magic URL
//     // account
//     //   .updateMagicURLSession(userId, secret)
//     //   .then((session) => {
//         // Successfully verified the email and got the session
//         setLoading(true); // Start the process of token generation
//         let responseData;

//         // Fetch the backend to generate token after successful verification
//         fetch('http://localhost:4000/signup', {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email: session.email }), // Send the user's email to the backend
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             responseData = data;
//             if (responseData?.success) {
//               console.log(responseData.token);
//               localStorage.setItem("auth-token", responseData.token);
//             } else {
//               setLoading(false);
//               setError("Failed to generate token. Please try again.");
//             }
//           })
//           .catch((err) => {
//             setLoading(false);
//             console.error(err);
//             setError("Sign-up failed. Please try again.");
//           });
//       }
//       catch(err) {
//         console.error(err);
//         setError("Failed to verify email. Please try again.");
//         setLoading(false);
//       };
//     }

//   useEffect(() => {
//     setLoading(true);
//     const urlParams = new URLSearchParams(location.search);
//     const userId = urlParams.get("userId");
//     const secret = urlParams.get("secret");

//     console.log("userId ", userId);
//     console.log("secret : ", secret);

//     if (!userId || !secret) {
//       setError("Invalid or expired Magic URL");
//       setLoading(false);
//       return;
//     }

//     else{
//       verifyMagicURL(userId,secret);
//     }

    
//     // const verifyMagicURL = async (userId, secret) => {
//     // try{
//     //   await account.updateMagicURLSession(userId, secret); // Verifies the user
//     //   const session = await account.get(); // Fetch user details
//     //   console.log("User email:", session.email);
//     // // Verify the session with Appwrite's Magic URL
//     // // account
//     // //   .updateMagicURLSession(userId, secret)
//     // //   .then((session) => {
//     //     // Successfully verified the email and got the session
//     //     setLoading(true); // Start the process of token generation
//     //     let responseData;

//     //     // Fetch the backend to generate token after successful verification
//     //     fetch('http://localhost:4000/signup', {
//     //       method: 'POST',
//     //       headers: {
//     //         Accept: 'application/json',
//     //         'Content-Type': 'application/json',
//     //       },
//     //       body: JSON.stringify({ email: session.email }), // Send the user's email to the backend
//     //     })
//     //       .then((res) => res.json())
//     //       .then((data) => {
//     //         responseData = data;
//     //         if (responseData?.success) {
//     //           // Store the token in localStorage after receiving the response
//     //           console.log(responseData.token);
//     //           localStorage.setItem("auth-token", responseData.token);
//     //           setLoading(false); // Done with the token generation
//     //         } else {
//     //           setLoading(false);
//     //           setError("Failed to generate token. Please try again.");
//     //         }
//     //       })
//     //       .catch((err) => {
//     //         setLoading(false);
//     //         console.error(err);
//     //         setError("Sign-up failed. Please try again.");
//     //       });
//     //   }
//     //   catch(err) {
//     //     console.error(err);
//     //     setError("Failed to verify email. Please try again.");
//     //     setLoading(false);
//     //   };
//     // }
//   }, [location]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
//       <Hero />
//       <Popular />
//       <Offers />
//       <NewCollection />
//       <NewLetter />
//     </div>
//   );
// }

// export default Shop;



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
      const response = await fetch("http://localhost:4000/signup", {
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

