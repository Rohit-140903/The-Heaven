import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Success.css';

const Success = () => {
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <div className="message success">
                <h1>Success!</h1>
                <p>Your transaction was completed successfully.</p>
                <div className = "btn">
                <button onClick={redirectToHome} className = "success-btn">Continue Shopping</button>
                </div>
            </div>
        </div>
    );
};

export default Success;

