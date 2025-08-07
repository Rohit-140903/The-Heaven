
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
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-payment-status/${sessionId}`)
                .then((response) => response.json())
                .then(async (data) => {
                    if (data.success) {
                        console.log("Stock updated successfully!");
                        console.log(data.orderProducts);

                        const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addOrder`, {
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
    const [alreadyProcessed, setAlreadyProcessed] = useState(false);

    useEffect(() => {
        if (!sessionId || alreadyProcessed) return;

        let isMounted = true; // Flag to avoid updates if unmounted

        const checkPayment = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check-payment-status/${sessionId}`);
                const data = await response.json();

                if (!isMounted) return;

                if (data.success) {
                    if (data.alreadyProcessed) {
                        console.log("Payment was already processed, skipping API call.");
                        setAlreadyProcessed(true);
                        return;
                    }

                    console.log("Stock updated successfully!");
                    console.log(data.orderProducts);

                    const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/addOrder`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "auth-token": localStorage.getItem("auth-token"),
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ products: data.orderProducts }),
                    });

                    const orderData = await orderResponse.json();
                    if (orderResponse.ok) {
                        console.log("Order placed successfully!");
                    } else {
                        setError(orderData.error || "Failed to place order.");
                    }
                } else {
                    console.log(data);
                }
            } catch (error) {
                console.error("Error checking payment status:", error);
                setError("An error occurred while verifying the payment.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkPayment();
    }, [sessionId, alreadyProcessed]);

    const redirectToHome = () => {
        navigate('/');
    };

    return (
        <>
            {loading && !error && (
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
                        {/* {error && <p className="error-text">{error}</p>} */}
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