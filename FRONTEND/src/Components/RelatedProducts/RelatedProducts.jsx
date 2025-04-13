import React, { useContext } from 'react';
import './RelatedProducts.css';
import data_product from '../Assets/data';
import Items from '../Items/Items'
import { ShopContext } from "../../Context/ShopContext";

const RelatedProducts = (props) => {
    const {product} = props;
    const {all_product} = useContext(ShopContext);
    const relatedProducts = all_product.filter(item => 
        item.category === product.category && item.id !== product.id
    );
    return (
        <div className = "relatedproducts">
            <h1>Related Products</h1>
            <hr />
            <div className = "relatedproducts-item">
                {relatedProducts.map((item,key) =>{
                    return <Items key = {key} id = {item.id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price} />
                }
                )}
            </div>
        </div>
    )
}

export default RelatedProducts