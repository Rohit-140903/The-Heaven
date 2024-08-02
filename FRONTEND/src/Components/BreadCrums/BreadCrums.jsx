import React from "react";
import './BreadCrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png';

function Breadcrum(props) {
    const { product } = props;

    if (!product) {
        return <div className="breadcrum">Loading...</div>; // or any fallback UI you prefer
    }

    return (
        <div className="breadcrum">
            HOME <img src={arrow_icon} alt="" />
            SHOP <img src={arrow_icon} alt="" />
            {product.category}
            <img src={arrow_icon} alt="" />
            {product.name}
        </div>
    );
}

export default Breadcrum;