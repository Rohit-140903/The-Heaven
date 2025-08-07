import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import remove_icon from '../../assets/remove_icon.png';
import { useNavigate } from 'react-router-dom';

export default function ListProduct() {
  const [allproducts, setAllProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(String(import.meta.env.VITE_AUTH_TOKEN));
    if (token) {
      setIsAuthenticated(true);
      fetchInfo(); // Fetch products only if authenticated
    } else {
      setIsAuthenticated(false);
      navigate('/Adminlogin')
    }
  }, []);

  const fetchInfo = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/allProducts`);
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const remove_product = async (id) => {
    setLoading(true); // Start loading
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/removeProduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      fetchInfo(); // Refresh product list after removal
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!isAuthenticated) {
    return null; // Do not render anything if not authenticated
  }

  return (
    <div className='list-product'>
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

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
            <div key={index}>
              <div className='listproduct-format-main listproduct-format'>
                <img src={product.image} alt="" className='listproduct-product-icon' />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img 
                  onClick={() => remove_product(product.image_public_id)} 
                  className='listproduct-remove-icon' 
                  src={remove_icon} 
                  alt="Remove" 
                />
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}
