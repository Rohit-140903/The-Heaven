import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/Product_Cart.svg';
import list_product_icon from '../../assets/Product_list_icon.svg';
import update_stock_icon from '../../assets/stock-svgrepo-com.svg';
import order_list_icon from '../../assets/order-list.svg';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to={'/addProduct'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                    <img src={add_product_icon} alt="Add Product" />
                    <p>Add Product</p>
                </div>
            </Link>

            <Link to={'/listProduct'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                    <img src={list_product_icon} alt="Product List" />
                    <p>Product List</p>
                </div>
            </Link>

            <Link to={'/updateStock'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                <img src={update_stock_icon} alt="Update Stock" className="update-stock-icon" />
                    <p>Update Stock</p>
                </div>
            </Link>
            <Link to={'/allOrders'} style={{ textDecoration: "none" }}>
                <div className="sidebar-item">
                <img src={order_list_icon} alt="Orders List" className="order-list-icon" />
                    <p>Orders List</p>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
