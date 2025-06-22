
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AllOrders.css';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMailIndex, setSendingMailIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN);
    if (!token) {
      navigate("/Adminlogin");
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/allOrders");
      const data = await res.json();
      if (data.success) setOrders(data.Orders);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };



const handleDateChange = async (index, newDate) => {
  const updatedOrders = [...orders];
  updatedOrders[index].deliveredAt = newDate;
  setOrders(updatedOrders);

  const { orderId, userEmail } = updatedOrders[index];

  console.log(updatedOrders[index]);

  console.log(orderId,userEmail);

  await fetch("http://localhost:4000/api/updateOrder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      userEmail,
      deliveredAt: newDate,
    }),
  });
};

const handleCompletedToggle = async (index) => {
  const updatedOrders = [...orders];
  const newStatus = !updatedOrders[index].completed;
  updatedOrders[index].completed = newStatus;
  setOrders(updatedOrders);

  const { orderId, userEmail,deliveredAt } = updatedOrders[index];

  await fetch("http://localhost:4000/api/updateOrder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      userEmail,
      deliveredAt,
      completed: newStatus,
    }),
  });
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
          deliveryDate: order.deliveredAt,
        }),
      });

      const result = await res.json();
      setToastMessage(result.success
        ? `Mail sent to ${order.userEmail}`
        : "Failed to send email");
    } catch (error) {
      console.error("Error sending mail:", error);
      setToastMessage("Error sending email");
    } finally {
      setSendingMailIndex(null);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const getToday = () => new Date().toISOString().split("T")[0];

  return (
    <div className="outer-box">
      <h2 className="order-list-title">Orders List</h2>

      {loading ? (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner" />
        </div>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="inner-orders-container">
          {orders.map((order, index) => (
            <div key={order._id} className={`order-box ${order.completed ? "order-completed" : ""}`}>
              <p><strong>OrderId:</strong> {order.orderId}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              <p><strong>Email:</strong> {order.userEmail}</p>
              <div className="order-address-details">
                <p><strong>Name:</strong> {order.address.fullName}</p>
                <p><strong>Phone:</strong> {order.address.phone}</p>
                <p><strong>City:</strong> {order.address.city}</p>
                <p><strong>Country:</strong> {order.address.country}</p>
              </div>
              <p>
                <strong>Product:</strong> {order.productName} |{" "}
                <strong>Qty:</strong> {order.quantity} |{" "}
                <strong>Price:</strong> ${order.price}
              </p>

              <label>
                <strong>Deliver later:</strong>
                <input
                  type="date"
                  min={getToday()}
                  value={order.deliveredAt ? order.deliveredAt.split("T")[0] : ""}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                />
              </label>

              {order.deliveredAt && (
                <p>Scheduled for: {order.deliveredAt.split("T")[0]}</p>
              )}

              <label>
                <input
                  type="checkbox"
                  checked={order.completed === true || order.completed === "true"}
                  onChange={() => handleCompletedToggle(index)}
                />{" "}
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
          ))}
        </div>
      )}

      {toastMessage && <div className="toast-popup">{toastMessage}</div>}
    </div>
  );
}

