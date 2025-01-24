import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Shop  from './Pages/Shop'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Footer from './Components/Footer/Footer'
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import Success from './Pages/Success';
import Failure from './Pages/Failure';

function App() {

  return (
    <>
      <div>
     
        <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path = '/' element = {<Shop/>} />
          <Route path = '/mens' element = {<ShopCategory banner = {men_banner} category = "men"/>} />
          <Route path = '/womens' element = {<ShopCategory banner = {women_banner} category = "women"/>} />
          <Route path = '/kids' element = {<ShopCategory  banner = {kid_banner} category = "kid"/>} />
          <Route path = '/product' element = {<Product/>}>
            <Route path = ':productId' element = {<Product/>} />
          </Route>

          <Route path = '/cart' element = {<Cart/>} />
          <Route path = '/login' element = {<LoginSignup/>} />
          <Route path = '/success' element = {<Success />} />
          <Route path = '/failure' element = {<Failure />} />
    


        </Routes>
        <Footer/>
      </BrowserRouter>
      
      </div>
    
    </>
  )
}

export default App
