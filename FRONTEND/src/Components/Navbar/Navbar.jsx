// import React, { useContext, useRef, useState } from "react";
// import './Navbar.css'
// import logo from '../Assets/logo.png'
// import cart_icon from '../Assets/cart_icon.png'
// import { Link } from "react-router-dom";
// import { ShopContext } from "../../Context/ShopContext";
// import nav_dropdown from '../Assets/nav_dropdown.png';

// function Navbar (){
//     const [menu,setMenu] = useState("shop");
//     const {getTotalCartItems} = useContext(ShopContext);
//     const menuRef = useRef();

//     const dropdown_toggle =  (e) =>{
//         menuRef.current.classList.toggle('nav-menu-visible');
//         e.target.classList.toggle('open');
//     }

//     return(
//         <div className="navbar">
//             <div className = "nav-logo">
//                 <img src = {logo} alt = ""/>
//                 <p>THE HEAVEN</p>
//             </div>
//             <img  className = 'nav-dropdown' onClick = {dropdown_toggle} src = {nav_dropdown} alt = "" />
//             <ul ref = {menuRef} className = "nav-menu">
//                 <li onClick = {()=>setMenu("shop")}> <Link style = {{textDecoration : 'none'}} to = '/'>Shop</Link>{menu === "shop"?<hr/> : <></>}</li>
//                 <li onClick = {()=>setMenu("men")}><Link style = {{textDecoration : 'none'}} to = '/mens'>Men</Link> {menu === "men"?<hr/> : <></>}</li>
//                 <li onClick = {()=>setMenu("women")}><Link style = {{textDecoration : 'none'}} to = '/womens'>Women</Link>{menu === "women"?<hr/> : <></>}</li>
//                 <li onClick = {()=>setMenu("kid")}><Link style = {{textDecoration : 'none'}} to = '/kids'>Kids</Link>{menu === "kid"?<hr/> : <></>}</li>
//                 <li onClick = {()=>setMenu("OrderHistory")}><Link style = {{textDecoration : 'none'}} to = '/orderHistory'>OrderHistory</Link>{menu === "OrderHistory"?<hr/> : <></>}</li>
//             </ul>

//             <div className = "nav-login-cart">
//             {/* check for auth-token available or not if auth-token is available means user is login */}
//                 {localStorage.getItem('auth-token') ? <button onClick  = { () => {localStorage.removeItem('auth-token');
//                     window.location.replace('/');
//                 }}>Logout</button>
//                 :<Link to = '/login'><button>Login</button> </Link>}

//                 <Link to = '/cart'><img src = {cart_icon} alt = "" /></Link>
//                 <div className = "nav-cart-count">{getTotalCartItems()}</div>

//             </div>

//         </div>
//     )
// }

// export default Navbar

import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuLogOut } from "react-icons/lu";

function Navbar() {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false); // For dropdown
  const isLoggedIn = localStorage.getItem("auth-token");

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="navbar" style={{
      zIndex: "1000",
      position: "fixed",
      top: "0",
      width: "100%",
      backgroundColor: "white",
    }}>
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>THE HEAVEN</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("men")}>
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "men" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("women")}>
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>
          {menu === "women" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("kid")}>
          <Link style={{ textDecoration: "none" }} to="/kids">
            Kids
          </Link>
          {menu === "kid" ? <hr /> : <></>}
        </li>

        {/* <li onClick={() => setMenu("OrderHistory")}>
                    <Link style={{ textDecoration: 'none' }} to='/orderHistory'>OrderHistory</Link>{menu === "OrderHistory" ? <hr /> : <></>}
                </li> */}
      </ul>

      <div className="nav-login-cart">
        {/* Circular Profile Button */}
        <div className="profile-menu"
        style={{
          height: "0px",
          translate: "0 -15px",
        }}>
          <GiHamburgerMenu
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />{" "}
          {/* You can replace this with an icon */}
          {menuOpen && (
            <div className="dropdown-menu" style={{
              zIndex: "1000",
            }}>
              {isLoggedIn ? (
                <div style={{
                  translate: "0 -10px",
                  position: "fixed",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "baseline",
                  gap: "10px",
                  background: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "translateX(-15%)",
                }}>
                  <Link to="/orderHistory">Order History</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("auth-token");
                      window.location.replace("/");
                    }}
                    className="log-out-btn"
                    style={{
                      background: "none",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <LuLogOut style={{
                      color: "red",
                    }}/>
                    <span style={{fontSize : "16px",color : "purple"}}>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </>
              )}
            </div>
          )}
        </div>


        {/* Cart Section */}
        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;
