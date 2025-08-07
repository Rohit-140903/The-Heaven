// NOT USEFUL******

import React, { useState } from "react";
import { Client, Account, ID } from "appwrite"; 
import './CSS/LoginSignup.css';

function LoginSignup() {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState({ email: "", password: "" }); 
    const [loading, setLoading] = useState(false); // Loading state

    const client = new Client()
        .setEndpoint(String(import.meta.env.VITE_APPWRITE_ENDPOINT)) 
        .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID));

    const account = new Account(client);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
        if (!regex.test(email)) {
            setError((prev) => ({ ...prev, email: "Please enter a valid email with a supported domain (gmail.com, yahoo.com, etc.)" }));
            return false;
        }
        setError((prev) => ({ ...prev, email: "" }));
        return true;
    };

    const login = async () => {
        if (!validateEmail(formData.email)) return;

        setLoading(true); // Show loading indicator

        let responseData;
        await fetch('${import.meta.env.VITE_BACKEND_URL}/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => responseData = data)
        .catch((err) => {
            setLoading(false);
            console.error(err);
            setError((prev) => ({ ...prev, password: "Login failed. Please try again." }));
        });

        if (responseData?.success) {
            localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); 
            sendMagicLink();
        } else {
            setLoading(false);
            setError((prev) => ({ ...prev, password: "Wrong password or email. Please try again." }));
        }
    };

    const signup = async () => {
        if (!validateEmail(formData.email)) return;

        setLoading(true); 

        let responseData;
        await fetch('${import.meta.env.VITE_BACKEND_URL}/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => responseData = data)
        .catch((err) => {
            setLoading(false);
            console.error(err);
            setError((prev) => ({ ...prev, password: "Sign-up failed. Please try again." }));
        });

        if (responseData?.success) {
            localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); 
            sendMagicLink();
        } else {
            setLoading(false);
            setError((prev) => ({ ...prev, email: "Email already exist" }));
        }
    };

    const sendMagicLink = async () => {
        try {
            const response = await account.createMagicURLToken(
                ID.unique(),
                formData.email, 
                'http://localhost:5173' 
            );
            alert("Magic URL sent! Please check your email.");
        } catch (err) {
            console.error(err);
            alert("Failed to send magic URL.");
        }
    };

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" && (
                        <input type="text" name="name" value={formData.name} onChange={changeHandler} placeholder="Your Name" />
                    )}
                    <div>
                        <input 
                            type="text" 
                            name="email" 
                            value={formData.email} 
                            onChange={changeHandler} 
                            placeholder="Email Address" 
                        />
                        {error.email && <p style={{ color: 'red', fontSize: '17px' }}>{error.email}</p>}
                    </div>
                    <div>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={changeHandler} 
                            placeholder="Password" 
                        />
                        {error.password && <p style={{ color: 'red', fontSize: '17px' }}>{error.password}</p>}
                    </div>
                </div>
                <button onClick={() => { state === "Sign Up" ? signup() : login() }} disabled={loading}>
                    {loading ? "Loading..." : "Continue"}
                </button>
                {state === "Sign Up" ? (
                    <p className="loginsignup-login">
                        Already have an account? <span onClick={() => { setState("Login") }}>Login here</span>
                    </p>
                ) : (
                    <p className="loginsignup-login">
                        Create an Account? <span onClick={() => setState("Sign Up")}>Click here</span>
                    </p>
                )}
                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;
