import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://ecommerce-project-1-xbgb.onrender.com/orders/my-orders", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading orders...</h2>;

  if (orders.length === 0) return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      <p>No orders yet!</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order.order_id} style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          border: "1px solid gray",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>

          <img
            src={order.image_url}
            alt={order.product_name}
            width="100"
            height="100"
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />

          <div>
            <h3 style={{ margin: 0 }}>{order.product_name}</h3>
            <p style={{ margin: 0 }}>Quantity: {order.quantity}</p>
            <p style={{ margin: 0, color: "green", fontWeight: "bold" }}>
              Total: ₹{order.total_price}
            </p>
            <p style={{ margin: 0 }}>
              Status: <span style={{ color: "orange" }}>{order.status}</span>
            </p>
            <p style={{ margin: 0, color: "gray", fontSize: "12px" }}>
              {order.created_at}
            </p>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Orders;