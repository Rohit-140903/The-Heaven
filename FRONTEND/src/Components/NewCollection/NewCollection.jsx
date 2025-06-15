import React, { useEffect, useState } from "react";
import './NewCollection.css';
import Items from "../Items/Items";

function NewCollection() {
  const [new_collection, setNew_Collection] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading spinner
      try {
        const response = await fetch("http://localhost:4000/api/newcollections");
        const data = await response.json();
        setNew_Collection(data);
      } catch (error) {
        console.error("Error fetching new collections:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  return (
    <div className="new-collection">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      {loading ? (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="collection">
          {new_collection.map((item) => (
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

export default NewCollection;
