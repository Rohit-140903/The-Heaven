import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import remove_icon from '../../assets/remove_icon.png';

export default function ListProduct() {

  const [allproducts, setAllProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchInfo(); // Fetch products only if authenticated
    } else {
      setIsAuthenticated(false);
      alert("Please log in first.");
    }
  }, []);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allProducts')
      .then((res) => res.json())
      .then((data) => { setAllProducts(data) });
  };

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeProduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    fetchInfo(); // Refresh product list after removal
  };

  if (!isAuthenticated) {
    return null; // Do not render anything if not authenticated
  }

  return (
    <div className='list-product'>
      <h1>All Products</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className='listproduct-allproducts'>
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div key={index} className='listproduct-format-main listproduct-format'>
                <img src={product.image} alt="" className='listproduct-product-icon' />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={remove_icon} alt="" />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
}
