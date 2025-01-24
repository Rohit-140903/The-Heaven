import React, { useState } from "react";
import { Client, Account, ID } from "appwrite"; // Import Appwrite SDK
import './CSS/LoginSignup.css';

function LoginSignup() {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    // Initialize Appwrite Client
    const client = new Client()
        .setEndpoint(String(import.meta.env.VITE_APPWRITE_ENDPOINT)) // Replace with your Appwrite endpoint
        .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID));                 // Replace with your Appwrite Project ID

    const account = new Account(client);

    const login = async () => {
        console.log("Login Function Executed Successfully", formData);
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); // Save JWT token
            // After JWT verification, trigger Appwrite Magic URL
            sendMagicLink();
        } else {
            alert(responseData.errors);
        }
    };

    const signup = async () => {
        console.log("Sign Up Function Executed Successfully", formData);
        let responseData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => responseData = data);

        if (responseData.success) {
            localStorage.setItem(String(import.meta.env.VITE_AUTH_TOKEN), responseData.token); // Save JWT token
            // After successful signup, trigger Appwrite Magic URL
            sendMagicLink();
        } else {
            alert(responseData.errors);
        }
    };

    const sendMagicLink = async () => {
        try {
            const response = await account.createMagicURLToken(
                ID.unique(), // Generate a unique ID for the magic URL
                formData.email, // Email address for the magic URL
                'http://localhost:5173' // Redirect to the home route
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
                    {state === "Sign Up" ? (
                        <input type="text" name="name" value={formData.name} onChange={changeHandler} placeholder="Your Name" />
                    ) : null}
                    <input type="text" name="email" value={formData.email} onChange={changeHandler} placeholder="Email Address" />
                    <input type="password" name="password" value={formData.password} onChange={changeHandler} placeholder="Password" />
                </div>
                <button onClick={() => { state === "Sign Up" ? signup() : login() }}>Continue</button>
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
