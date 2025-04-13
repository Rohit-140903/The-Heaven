// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import './CSS/Success.css';
// import { GoArrowRight } from "react-icons/go";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// const Success = () => {
//     const navigate = useNavigate();
//     const[error,setError] = useState();

//     const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");

//   useEffect(() => {
//     if (sessionId) {
//       fetch(`http://localhost:4000/check-payment-status/${sessionId}`)
//         .then((response) => response.json())
//         .then(async (data) => {
//           if (data.success) {
//             console.log("Stock updated successfully!");
//             const orderResponse = await fetch('http://localhost:4000/addOrder', {
//               method: "POST",
//               headers: {
//                 Accept: "application/form-data",
//                 "auth-token": `${localStorage.getItem("auth-token")}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ products: data.orderProducts})
//           });

//           const orderData = await orderResponse.json();
//           if (orderResponse.ok) {
//               console.log("Order placed successfully!");
//               setSuccess(true);
//           } else {
//               setError(orderData.error || "Failed to place order.");
//           }
      
//           } else {
//             console.log("visit the URL again!");
//           }
//         })
//         .catch((error) => console.error("Error checking payment status:", error));
//     }
//   }, [sessionId]);


//     const redirectToHome = () => {
//         navigate('/');
//     };

//     return (

//         <>
//         <div className="outer-success-container">
//           <div className="success-container">
//             <div className="message">
//                 <DotLottieReact className='hello'
//                   src="https://lottie.host/87cccdf9-ff2d-4ad5-ac0f-a4f099ab1027/sbk6l3z6GO.lottie"
//                   autoplay
//                 />
//                 <h3>Your transaction was completed <br /> successfully!</h3>
//             </div>
//             <button onClick={redirectToHome} className = "success-btn">
//               Continue Shopping
//               <GoArrowRight id='right-arrow' />
//             </button>
//           </div>
//         </div>
//         </>
//     );
// };

// export default Success;


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CSS/Success.css';
import { GoArrowRight } from "react-icons/go";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Success = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            fetch(`http://localhost:4000/check-payment-status/${sessionId}`)
                .then((response) => response.json())
                .then(async (data) => {
                    if (data.success) {
                        console.log("Stock updated successfully!");
                        console.log(data.orderProducts);

                        const orderResponse = await fetch('http://localhost:4000/addOrder', {
                            method: "POST",
                            headers: {
                                Accept: "application/form-data",
                                "auth-token": `${localStorage.getItem("auth-token")}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ products: data.orderProducts })
                        });

                        const orderData = await orderResponse.json();
                        if (orderResponse.ok) {
                            console.log("Order placed successfully!");
                        } else {
                            setError(orderData.error || "Failed to place order.");
                        }
                    } else {
                        console.log(data);
                        setError("Visit the URL again! "+ data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error checking payment status:", error);
                    setError("An error occurred while verifying the payment.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [sessionId]);

    const redirectToHome = () => {
        navigate('/');
    };

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            <div className="outer-success-container">
                <div className="success-container">
                    <div className="message">
                        <DotLottieReact className='hello'
                            src="https://lottie.host/87cccdf9-ff2d-4ad5-ac0f-a4f099ab1027/sbk6l3z6GO.lottie"
                            autoplay
                        />
                        <h3>Your transaction was completed <br /> successfully!</h3>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                    <button onClick={redirectToHome} className="success-btn">
                        Continue Shopping
                        <GoArrowRight id='right-arrow' />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Success;