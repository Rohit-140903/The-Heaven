import React, { useEffect, useState } from "react";
import './Popular.css';
// import data_product from '../Assets/data';
import Items from "../Items/Items";

function Popular(){

    const [popularItem,setPopularItem] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:4000/popularinwomen')
        .then((res) => res.json())
        .then((data)=>setPopularItem(data))
    },[]);

    return(
        <div className = 'popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className = "popular-item">
                {popularItem.map((item,i) =>{
                    return <Items key = {i} id = {item.id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price} />
                }
            )}
            </div>

        </div>
    )
}

export default Popular