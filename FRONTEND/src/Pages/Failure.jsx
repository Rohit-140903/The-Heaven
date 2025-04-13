// import React from 'react';
// import './CSS/Failure.css';
// import {useNavigate } from 'react-router-dom';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';



// const Failure = () => {
//     const navigate = useNavigate();

//     const paymentHandler = () =>{
//         navigate('/cart');
//     }
//     const shopHandler = () => {
//         navigate('/');
//     }


//     return (
//         // <div className="container">
//         //     <div className="message failure">
//         //         <h1>Failed!</h1>
//         //         <p>some error occured during payment, choose one option below.</p>
//         //         <div className = "btn">
//         //             <button onClick = {paymentHandler} className = "payment">Click here for Payment Again</button>
//         //             <button onClick = {shopHandler} className = "shop">Go to Shop</button>
//         //         </div>
//         //     </div>
//         // </div>
//         <>  
//         <div className="outer-failure-container">
//             <div className="failure-card">
//                 <div className="failure-message">
//                     <DotLottieReact className='fail-id'
//                     src="https://lottie.host/56aa3059-01e0-459f-8fcd-2ff129537cdc/lJNGbksWDi.lottie"
//                     loop
//                     autoplay
//                     />
//                     <h3>some error occured during payment!</h3>
//                 </div>
//                 <div className="failure-btn">
//                     <button onClick = {paymentHandler} className = "payment">Payment Again</button>
//                     <button onClick = {shopHandler} className = "shop">Go to Shop</button>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Failure;

import React, { useState, useEffect } from 'react';
import './CSS/Failure.css';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Failure = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading delay (e.g., fetching animation data)
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const paymentHandler = () => {
        navigate('/cart');
    };

    const shopHandler = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="loading-spinner-overlay">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="outer-failure-container">
            <div className="failure-card">
                <div className="failure-message">
                    <DotLottieReact
                        className='fail-id'
                        src="https://lottie.host/56aa3059-01e0-459f-8fcd-2ff129537cdc/lJNGbksWDi.lottie"
                        loop
                        autoplay
                    />
                    <h3>Some error occurred during payment!</h3>
                </div>
                <div className="failure-btn">
                    <button onClick={paymentHandler} className="payment">Payment Again</button>
                    <button onClick={shopHandler} className="shop">Go to Shop</button>
                </div>
            </div>
        </div>
    );
};

export default Failure;

