import React from 'react';
 import './home.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import {Routes,Route} from 'react-router-dom';
import AddProduct from '../Components/AddProduct/AddProduct';
import ListProduct from '../Components/ListProduct/ListProduct';

const Home = ()=>{
    return (
        <div className = "home">
            <Sidebar />
            <Routes>
                <Route path = '/addProduct' element = {<AddProduct />} />
                <Route path = '/listProduct' element = {<ListProduct />} />
            </Routes>
        </div>
    )
}
export default Home;