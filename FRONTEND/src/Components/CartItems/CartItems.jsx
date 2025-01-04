import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from "../Assets/remove_icon.png";
import {loadStripe} from '@stripe/stripe-js';

export default function CartItems () {

    const {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount} = useContext(ShopContext);

    const makePayment = async() =>{
        
        try{
        const stripe=await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
        const body = {
            products : all_product,
            total_amount : getTotalCartAmount(),
            quantity:cartItems,

        }

        const headers = {
            'Content-Type' : 'application/json'
        }

        const response = await fetch("http://localhost:4000/create-checkout-session",{
            method : "POST",
            headers:headers,
            body:JSON.stringify(body),
        })

        // response.ok == It returns true if the response's status code is in the range of 200–299 (successful HTTP responses)

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create checkout session.");
        }

        const session = await response.json();
        const result = stripe.redirectToCheckout({
            sessionId : session.id,
        });
    } // end of try block
    catch(err){
        alert(err.message);
    }
}




    
    return (
        <div className = "cartitems">
            <div className = "cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr/>
                {all_product.map((item)=>{
                    if(cartItems[item.id] > 0){
                        return ( <div>
                        <div className = "cartitems-format  cartitems-format-main">
                            {/* iska matlab isme do class ka css Property lag sakta hai */}
                            <img src = {item.image} alt = "" className = "carticon-product-icon" />
                            <p>{item.name}</p>
                            <p>${item.new_price}</p>
                            <button className = "cartitems-quantity">{cartItems[item.id]}</button>
                            <p>${item.new_price * cartItems[item.id]}</p>
                            <img className = "cartitems-remove-icon" src = {remove_icon} onClick={()=>{removeFromCart(item.id)}} alt = " "/>
                        </div>
                        <hr />
                    </div>
                        )
                    }
                    return null;
                }
                )}
                <div className = "cartitems-down">
                    <div className="cartitems-total">
                        <h1>Cart Totals</h1>
                       <div>
                          <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className='cartitems-total-item'>
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button onClick = {makePayment}>PROCEED TO CHECKOUT</button>
                </div>
                    <div className='cartitems-promocode'>
                        <p>If you have a promo code, Enter it here</p>
                        <div className = "cartitems-promobox">
                            <input type='text'placeholder='promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
               </div> 
        </div>
    )
}