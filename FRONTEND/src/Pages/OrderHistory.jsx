// import React, { useEffect, useState } from "react";
// import "./CSS/OrderHistory.css";

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrderHistory = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/orderHistory", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "auth-token": `${localStorage.getItem("auth-token")}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setOrders(data);
//         } else {
//           setError(data.error || "Failed to fetch order history");
//         }
//       } catch (err) {
//         setError("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderHistory();
//   }, []);

//   return (
//     <div className="his-outer-container">
//       {loading && <div className="spinner">Loading...</div>}
//       {error && <p className="error">{error}</p>}
//       {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

//       {!loading && orders.length > 0 && (
//         <div className="his-container">
//           {orders.map((order) => {
//             const totalPrice = order.products.reduce(
//               (sum, product) => sum + product.quantity * product.price,
//               0
//             );

//             return (
//               <div key={order._id} className="his-box">
//                 <div className="his-heading">
//                   <h2>Order Details</h2>
//                   <h4>Status: Payment Successful</h4>
//                   <h4>Total Price: ${totalPrice}</h4>
//                 </div>

//                 <div className="his-docs-container">
//                   {order.products.map((product) => {
//                     const formattedProductDate = product.createdAt
//                       ? new Date(product.createdAt).toLocaleString()
//                       : "N/A";

//                     return (
//                       <div key={product._id || Math.random()} className="his-docs">
//                         <div className="his-docs-box">
//                           <div className="his-docs-pic">
//                             <img src={product.image || "/placeholder.png"} alt={product.name} />
//                           </div>
//                           <div className="his-docs-details">
//                             <h3>{product.name}</h3>
//                             <h4>Quantity: {product.quantity}</h4>
//                             <h4>Price: ${product.price}</h4>
//                             <h4>Added On: {formattedProductDate}</h4>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;

import React, { useEffect, useState } from "react";
import "./CSS/OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch("http://localhost:4000/orderHistory", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "auth-token": `${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to fetch order history");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="his-outer-container">
      {/* Loading Spinner Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {error && (
        <p className="error" style={{ color: "red", fontSize: "30px" }}>
          {error}
        </p>
      )}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && orders.length > 0 && (
        <div className="his-container">
          {orders.map((order) => {
            const totalPrice = order.products.reduce(
              (sum, product) => sum + product.quantity * product.price,
              0
            );

            return (
              <div key={order._id} className="his-box">
                <div className="his-heading">
                  <h2>Order Details</h2>
                  <h4>Status: Payment Successful</h4>
                  <h4>Total Price: ${totalPrice}</h4>
                </div>

                <div className="his-docs-container">
                  {order.products.map((product) => {
                    const formattedProductDate = product.createdAt
                      ? new Date(product.createdAt).toLocaleString()
                      : "N/A";

                    return (
                      <div
                        key={product._id || Math.random()}
                        className="his-docs"
                      >
                        <div className="his-docs-box">
                          <div className="his-docs-pic">
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                            />
                          </div>
                          <div className="his-docs-details">
                            <h3>{product.name}</h3>
                            <h4>Quantity: {product.quantity}</h4>
                            <h4>Price: ${product.price}</h4>
                            <h4>Added On: {formattedProductDate}</h4>
                          </div>
                        </div>
                        <div className="address-details-order">
                          <h1>Delivered To : </h1>
                          
                          <span><strong>Full Name:</strong> {product.address.fullName}</span>
                          <br />
                          <span><strong>Phone:</strong> {product.address.phone}</span><br />
                          <div className = "first-details">
                          <span>
                            <strong>Street:</strong> {product.address.street}
                          </span>
                          <span>
                            <strong>City:</strong> {product.address.city}
                          </span>
                          <span>
                            <strong>State:</strong> {product.address.state}
                          </span>
                          </div>
                          <div className="second-details">
                          <span>
                            <strong>Pincode : </strong>{product.address.zip} 
                            </span>
                            <span>
                            <strong>Country : </strong>{product.address.country}
                          </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
