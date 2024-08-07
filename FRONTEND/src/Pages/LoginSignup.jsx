import React, { useState } from "react";
import './CSS/LoginSignup.css';

function LoginSignup (){

    const [state,setState] = useState("Login");
    const [formData ,setFormData] = useState({
        name : "",
        email : "",
        password : ""

    })

    const login = async () =>{
        console.log("Login Functin Executed Successfully",formData);
        let responseData;
        await fetch('http://localhost:4000/login',{
            method : 'POST',
            headers : {
               Accept : 'application/form-data' ,
               'Content-Type' : 'application/json',
            },
            body : JSON.stringify(formData),
        })
        .then((res) =>res.json())
        .then((data) => responseData = data)

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token); // auth-token is key name of the token value
            window.location.replace("/"); // redirect to home route
        }else{
            alert(responseData.errors);
        }

    }

    const signup = async () =>{
        console.log("Sign Up Functin Executed Successfully",formData);
        let responseData;
        await fetch('http://localhost:4000/signup',{
            method : 'POST',
            headers : {
               Accept : 'application/form-data' ,
               'Content-Type' : 'application/json',
            },
            body : JSON.stringify(formData),
        })
        .then((res) =>res.json())
        .then((data) => responseData = data)

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token); // auth-token is key name of the token value
            window.location.replace("/"); // redirect to home route
        }else{
            alert(responseData.errors);
        }
        
    }

    const changeHandler = (e) =>{
        setFormData({...formData,[e.target.name] : e.target.value});
    }


    return(
        <div className = "loginsignup">
            <div className = "loginsignup-container">
                <h1>{state}</h1>
                <div className = "loginsignup-fields">
                    {state === "Sign Up"? <input type = "text" name = 'name' value = {formData.name} onChange = {changeHandler} placeholder = "Your Name" /> :<></> }
                    <input type = "text" name = 'email' value = {formData.email} onChange = {changeHandler} placeholder = "Email Address" />
                    <input type = "password"  name = 'password' value = {formData.password} onChange= {changeHandler} placeholder = "Password" />
                </div>
                <button onClick={()=>{state === "Sign Up" ? signup():login()}}>Continue</button>
                {state === "Sign Up" ? <p className = "loginsignup-login">Already have an account? <span onClick={() => {setState("Login")}}>Login here</span></p>
                : <p className = "loginsignup-login">Create an Account? <span onClick = {() => setState("Sign Up")}>Click here</span></p>}
                <div className = "loginsignup-agree">
                    <input type = "checkbox" name = "" id = "" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup