import React from 'react';
import './Navbar.css';
import navProfile from '../../assets/nav-profile.svg'
import logo from '../../assets/logo.png';

function Navbar(){
    return(
        <div className = 'navbar'>
            <div className = "nav-logo">
            <img src = {logo} alt = ""/>
            <p>THE HEAVEN</p>
            </div>
            <div className = "nav-profile">
            <p>Admin Panel</p>
            <img src = {navProfile} alt = "" className = "" />
            </div>

        </div>
    )
}
export default Navbar;