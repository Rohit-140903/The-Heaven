import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Shop from "./Pages/Shop";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
// import LoginSignup from "./Pages/LoginSignup";
import Footer from "./Components/Footer/Footer";
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kid_banner from "./Components/Assets/banner_kids.png";
import Success from "./Pages/Success";
import Failure from "./Pages/Failure";
import ClientInformation from "./Pages/ClientInformation";
import ClientInformationBuyNow from "./Pages/ClientInformationBuyNow";
import OrderHistory from "./Pages/OrderHistory";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyEmail from "./Pages/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar />
          <div style={{
            marginTop: "80px"
          }}>
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route
              path="/mens"
              element={<ShopCategory banner={men_banner} category="men" />}
            />
            <Route
              path="/womens"
              element={<ShopCategory banner={women_banner} category="women" />}
            />
            <Route
              path="/kids"
              element={<ShopCategory banner={kid_banner} category="kid" />}
            />
            <Route path="/product" element={<Product />}>
              <Route path=":productId" element={<Product />} />
            </Route>

            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="/clientInformation" element={<ClientInformation />} />
            <Route
              path="/clientInformation-buy-now"
              element={<ClientInformationBuyNow />}
            />
            <Route path="/orderHistory" element={<OrderHistory />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path = "/reset-password" element = {<ResetPassword />} />
          </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
