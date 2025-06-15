import React, { useEffect, useState } from "react";
import './Popular.css';
import Items from "../Items/Items";

function Popular() {
  const [popularItem, setPopularItem] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading spinner
      try {
        const response = await fetch('http://localhost:4000/api/popularinwomen');
        const data = await response.json();
        setPopularItem(data);
      } catch (error) {
        console.error("Error fetching popular items:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      {loading ? (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="popular-item">
          {popularItem.map((item) => (
            <Items
              key={item.image_public_id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Popular;
