import React, { useEffect, useState } from "react";

export default function OrderList() {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryDates, setDeliveryDates] = useState({}); // index => date

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/allOrders");
      const data = await res.json();
      if (data.success) {
        setGroupedOrders(data.Orders);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverLater = (index, date) => {
    setDeliveryDates((prev) => ({
      ...prev,
      [index]: date,
    }));
  };

  const handleWithin7Days = (index) => {
    alert(`Order #${index + 1} will be delivered within 7 days.`);
  };

  return (
    <div>
      {loading && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="outer-box">
        <h2 className="order-list-title">Orders List</h2>
        {groupedOrders.length === 0 && (
          <p className="no-orders">No orders found</p>
        )}

        <div className="inner-orders-container">
          {groupedOrders.map((order, index) => (
            <div key={index} className="order-box">
              <p className="order-date">
                <strong>Date:</strong>{" "}
                {new Date(order.date).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              <p className="order-email">
                <strong>Email:</strong> {order.userEmail}
              </p>

              <div className="order-address-container">
                <strong>Address:</strong>
                <div className="order-address-details">
                  <p>
                    <strong>Full Name: </strong>{" "}
                    {order.address.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>Phone: </strong> {order.address.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Street: </strong> {order.address.street || "N/A"}
                  </p>
                  <p>
                    <strong>City: </strong> {order.address.city || "N/A"}
                  </p>
                  <p>
                    <strong>State: </strong>
                    {order.address.state || "N/A"}
                  </p>
                  <p>
                    <strong>Zip: </strong>
                    {order.address.zip || "N/A"}
                  </p>
                  <p>
                    <strong>Country: </strong>
                    {order.address.country || "N/A"}
                  </p>
                </div>
              </div>

              <p className="order-product-info">
                <strong>Product:</strong> {order.productName} |{" "}
                <strong>Qty:</strong> {order.quantity} | <strong>Price:</strong>{" "}
                ${order.price}
              </p>

              <div className="order-actions">
                <button
                  className="deliver-7-days-btn"
                  onClick={() => handleWithin7Days(index)}
                >
                  <h3>Deliver within 7 days</h3>
                </button>

                <label className="deliver-later-label">
                  <strong>Deliver later: </strong>
                  <input
                    type="date"
                    className="deliver-later-input"
                    onChange={(e) => handleDeliverLater(index, e.target.value)}
                  />
                </label>

                {deliveryDates[index] && (
                  <p className="scheduled-date">
                    Scheduled for: {deliveryDates[index]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
