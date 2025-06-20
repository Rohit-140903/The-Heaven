import React, { createContext, useEffect, useState } from "react";
// import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

// const getDefaultCart = () =>{
//   let cart = {};
//   for(let index = 0;index < 300+1;index++){
//     cart[index] = 0;
//   }
//   return cart;
// }

const ShopContextProvider = (props) => {
  const [all_product,setAll_Product] = useState([]);

  const getDefaultCart = () =>{
    let cart = {};
    const len = Object.keys(all_product).length;
    for(let index = 0;index <= len;index++){
      cart[index] = 0;
    }
    return cart;
  }

  
const [cartItems,setcartItems] = useState(getDefaultCart());

useEffect(() =>{
  fetch('http://localhost:4000/api/allProducts')
  .then((res) => res.json())
  .then((data) => setAll_Product(data));

  if(localStorage.getItem('auth-token')){
    fetch('http://localhost:4000/api/totalcartitems',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'auth-token': `${localStorage.getItem('auth-token')}` ,
        'Content_Type' : 'application/json',
      },
      body : "",
    })
    .then((res) => res.json())
    .then((data) => setcartItems(data))
  }
},[])


// const addToCart = (itemId)=>{
//   setcartItems((prev) =>({...prev,[itemId] : prev[itemId]+1}))
//   if(localStorage.getItem('auth-token')){
//     fetch('http://localhost:4000/api/addtocart',{
//       method:'POST',
//       headers:{
//         Accept:'application/form-data',
//         'auth-token' : `${localStorage.getItem('auth-token')}`,
//         'Content-Type' : 'application/json',
//       },
//       body:JSON.stringify({"itemId":itemId}),
//     })
//     .then((res) => res.json())
//     .then((data) => setAll_Product(data));
//   }
// }

const addToCart = (itemId) => {
  
  setcartItems((prev) => ({
    ...prev,
    [itemId]: (prev[itemId] || 0) + 1, 
  }));

  
  if (localStorage.getItem('auth-token')) {
    fetch('http://localhost:4000/api/addtocart', {
      method: 'POST',
      headers: {
        Accept: 'application/json', 
        'Content-Type': 'application/json', 
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ itemId }), 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cart) {
          setcartItems(data.cart); 
        } else {
          console.warn("Backend didn't return updated cart:", data);
        }
      })
      .catch((err) => {
        console.error("Error syncing with backend:", err);
      });
  }
};

 
// const removeFromCart = (itemId)=>{
//   setcartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
//   if(localStorage.getItem('auth-token')){ // if the user is login in that case auth-token will be generated
//   fetch('http://localhost:4000/removefromcart',{
//     method:'POST',
//     headers:{
//       Accept:'application/form-data',
//       'auth-token' : `${localStorage.getItem('auth-token')}`,
//       'Content-Type' : 'application/json',
//     },
//     body:JSON.stringify({"itemId":itemId}),
//   })
//   .then((res) => res.json())
//   .then((data) => setAll_Product(data));
//   }
// }

const removeFromCart = (itemId) => {
  setcartItems((prev) => {
    if (!prev[itemId] || prev[itemId] <= 1) { 
      const updatedCart = { ...prev };
      delete updatedCart[itemId]; // ✅ Remove item completely if count is 0
      return updatedCart;
    }
    return { ...prev, [itemId]: prev[itemId] - 1 };
  });

  if (localStorage.getItem("auth-token")) {
    fetch("http://localhost:4000/api/removefromcart", {
      method: "POST",
      headers: {
        Accept: "application/json",  // ✅ Corrected header
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cart) {
          setcartItems(data.cart);  // ✅ Update cartItems, not all_product
        } else {
          console.error("Unexpected API response format:", data);
        }
      })
      .catch((err) => console.error("Error updating cart:", err)); // ✅ Catch API errors
  }
};



const getTotalCartAmount = () => {
  let totalAmount = 0;
  for(const item in cartItems){
    if(cartItems[item] > 0){
      let itemInfo = all_product.find((product) => product.id === Number(item))
      totalAmount += itemInfo.new_price * cartItems[item];
    }
  }
  return totalAmount;
}

const getTotalCartItems = () =>{
  let totalCartItems = 0;

  for (const item in cartItems){
    if(cartItems[item] > 0){
    totalCartItems += cartItems[item];
    }
  }

  return totalCartItems;
}

const contextValue = {all_product,cartItems,addToCart,removeFromCart,getTotalCartAmount,getTotalCartItems}; 
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;