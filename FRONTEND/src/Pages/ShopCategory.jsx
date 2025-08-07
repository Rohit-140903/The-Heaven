import React,{useContext} from "react";
import './CSS/ShopCategory.css'
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Items from "../Components/Items/Items";

// const all_products = [
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 2,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?2",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 3,
//         name: "product 3",
//         image: "https://picsum.photos/200/300?random?3",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 4,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?4",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
//     {
//         id: 1,
//         name: "product 1",
//         image: "https://picsum.photos/200/300?random?1",
//         new_price: 50.00,
//         old_price: 80.50
//     },
// ]

function ShopCategory (props){
     const {all_product} = useContext(ShopContext);
    return(
        <div className = "shop-category">
            <img className = "shopcategory-banner" src = {props.banner} alt = "" />
            <div className = "shopcategory-indexSort">
                <p>
                    <span>Showing 1-12</span> out of 36 Products
                </p>
                <div className = "shopcategory-sort">
                    Sort by <img src = {dropdown_icon} alt = ""/>
                </div>
            </div>
           <div className = "shopcategory-products">
            {all_product.map((item,key) =>{
                if(props.category === item.category){
                return <Items key = {key} id = {item.id} name = {item.name} image = {item.image} new_price = {item.new_price} old_price = {item.old_price} />
                
                /* image = item.image so, item.image = image url which is requested in browser like ${import.meta.env.VITE_BACKEND_URL}/images/product_1732811665705.jpg 
                and then show this image to our site */

                }
                else {
                    return null;
                }
            }
            ) }
           </div>
           <div className = "shopcategory-loadmore">
             Explore More
           </div>
        </div>
    )
}

export default ShopCategory