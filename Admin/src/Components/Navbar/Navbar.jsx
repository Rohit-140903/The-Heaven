import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import navProfile from '../../assets/nav-profile.svg';
import logo from '../../assets/logo.png';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();


  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsAuthenticated(true); // User is authenticated
  //   } else {
  //     setIsAuthenticated(false); // User is not authenticated
  //   }
  // }, []); // Empty dependency array ensures this effect runs only once after initial mount

  // const handleLogout = (e) => {
  //  // e.preventDefault();
  //   localStorage.removeItem("token"); // Remove token from localStorage
  //   setIsAuthenticated(false); // Update state to reflect logged-out status
  //   //navigate("/Adminlogin"); // Redirect to login page
  // };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>THE HEAVEN</p>
      </div>

      <div className="nav-profile">
        <p>Admin Panel</p>
        <img src={navProfile} alt="Profile" className="profile-img" />
      </div>

      <div className="Admin-nav-login">
      {localStorage.getItem('token') ?
       <button onClick  = { () => 
                {
                  localStorage.removeItem('token');
                  window.location.replace('/Adminlogin');
                  // same as navigate or redirect('/Adminlogin');
                }
              }>Logout</button>

                :<Link to = '/Adminlogin'><button>Login</button> </Link>}
      </div>
    </div>
  );
}

export default Navbar;
