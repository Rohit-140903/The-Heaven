import React, { useEffect, useState } from "react";
import './NewCollection.css'
// import new_collection from '../Assets/new_collections'
import Items from "../Items/Items";
import { useSearchParams } from "react-router-dom";

function NewCollection (){

    const[new_collection, setNew_Collection] = useState([])

    useEffect(()=>{
        fetch("http://localhost:4000/newcollections")
        .then((res) => res.json())
        .then((data) => setNew_Collection(data));
    },[])

    return(
        <div className = "new-collection">
            <h1>NEW COLLECTIONS</h1>
            <hr/>
            <div className = "collection">
                {new_collection.map((item,key)=>{
                    return <Items key = {key} id = {item.id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price} />
                }
                )}
            </div>

        </div>
    )
}

export default NewCollection