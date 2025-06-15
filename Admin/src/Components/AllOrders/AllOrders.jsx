import React, { useEffect, useState } from "react";
import './AllOrders.css';

export default function OrderList() {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryDates, setDeliveryDates] = useState({});
  const [completedOrders, setCompletedOrders] = useState({});
  const [sendingMailIndex, setSendingMailIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/allOrders");
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
    alert(`Order #${index + 1} will be delivered Tomorrow.`);
  };

  const toggleCompleted = (index) => {
    setCompletedOrders((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sendMailToUser = async (order, index) => {
    setSendingMailIndex(index);
    try {
      const res = await fetch("http://localhost:4000/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: order.userEmail,
          name: order.address.fullName,
          product: order.productName,
          deliveryDate: deliveryDates[index] || "Tomorrow",
        }),
      });

      const result = await res.json();
      console.log("Mail response:", result.success);

      if (result.success) {
        setToastMessage(`Mail sent to ${order.userEmail}`);
      } else {
        setToastMessage("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending mail:", error);
      setToastMessage("Error sending email");
    } finally {
      setSendingMailIndex(null);
      setTimeout(() => setToastMessage(""), 3000);
    }
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

        {groupedOrders.length === 0 && !loading && (
          <p className="no-orders">No orders found</p>
        )}

        <div className="inner-orders-container">
          {groupedOrders.map((order, index) => (
            <div
              key={index}
              className={`order-box ${completedOrders[index] ? "order-completed" : ""}`}
            >
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
                  <p><strong>Full Name:</strong> {order.address.fullName || "N/A"}</p>
                  <p><strong>Phone:</strong> {order.address.phone || "N/A"}</p>
                  <p><strong>Street:</strong> {order.address.street || "N/A"}</p>
                  <p><strong>City:</strong> {order.address.city || "N/A"}</p>
                  <p><strong>State:</strong> {order.address.state || "N/A"}</p>
                  <p><strong>Zip:</strong> {order.address.zip || "N/A"}</p>
                  <p><strong>Country:</strong> {order.address.country || "N/A"}</p>
                </div>
              </div>

              <p className="order-product-info">
                <strong>Product:</strong> {order.productName} |{" "}
                <strong>Qty:</strong> {order.quantity} |{" "}
                <strong>Price:</strong> ${order.price}
              </p>

              <div className="order-actions">
                <button
                  className="deliver-Tomorrow-btn"
                  onClick={() => handleWithin7Days(index)}
                >
                  <h3>Deliver Tomorrow</h3>
                </button>

                <label className="deliver-later-label">
                  <strong>Deliver later:</strong>
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

                <label className="order-completed-checkbox">
                  <input
                    type="checkbox"
                    checked={!!completedOrders[index]}
                    onChange={() => toggleCompleted(index)}
                  />
                  Mark as Completed
                </label>

                <button
                  className="send-mail-btn"
                  onClick={() => sendMailToUser(order, index)}
                  disabled={sendingMailIndex === index}
                >
                  Send Mail
                  {sendingMailIndex === index && <span className="spinner-inline"></span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="toast-popup">{toastMessage}</div>
      )}
    </div>
  );
}
