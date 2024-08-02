import React from "react";
import './NewLetter.css'

function NewLetter (){
    return(
        <div className = "newletter">
         <h1>Get Exclusive Offers On Your Email</h1>  
         <p>Subscibe to our newsletter and stay updated</p> 
         <div>
            <input type = "email" placeholder="Enter your Email Id" />
            <button>Subscribe</button>
         </div>
        </div>
    )
}

export default NewLetter