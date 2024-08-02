import React from 'react';
import './CSS/Failure.css';
import {useNavigate } from 'react-router-dom';

const Failure = () => {
    const navigate = useNavigate();

    const paymentHandler = () =>{
        navigate('/cart');
    }
    const shopHandler = () => {
        navigate('/');
    }


    return (
        <div className="container">
            <div className="message success">
                <h1>Failed!</h1>
                <p>some error occured during payment, choose one option below.</p>
                <div className = "btn">
                    <button onClick = {paymentHandler} className = "payment">Click here for Payment Again</button>
                    <button onClick = {shopHandler} className = "shop">Go to Shop</button>
                </div>
            </div>
        </div>
    );
};

export default Failure;
