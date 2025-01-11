import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import {Routes,Route} from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import AdminLoginSignup from '../AdminLoginSignup';
import Home from '../home';

const Admin = ()=>{
    return (
        <div className = "admin">
            <Routes>
                <Route path='/Adminlogin' element = {<AdminLoginSignup />} />
                <Route path='*' element = {<Home />} /> 
                {/* <Route path = '/home/*' element = {<Home />} />
                // if we used this type then all routes are made like /home/addProduct and so on backend routes will be like this
                // but this is not standard practises
           */}
            </Routes>
        </div>
    )
}
export default Admin;