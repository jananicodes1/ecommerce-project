import { useEffect, useState } from "react";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    slug: "",
    image_url: "",
    description: "",
    base_price: "",
    sale_price: "",
    status: "Active"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/orders/all-orders", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      });

    fetch("http://127.0.0.1:8000/products/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (order_id, status) => {
    const token = localStorage.getItem("token");
    await fetch(
      "http://127.0.0.1:8000/orders/update-status/" + order_id + "?status=" + status,
      {
        method: "PUT",
        headers: { "Authorization": "Bearer " + token }
      }
    );
    setOrders(prev =>
      prev.map(o => o.order_id === order_id ? { ...o, status: status } : o)
    );
  };

  const addProduct = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/products/", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...newProduct,
        base_price: parseFloat(newProduct.base_price),
        sale_price: parseFloat(newProduct.sale_price)
      })
    });
    const data = await res.json();
    if (data.id) {
      alert("Product added!");
      setProducts(prev => [...prev, data]);
      setNewProduct({
        sku: "", name: "", slug: "", image_url: "",
        description: "", base_price: "", sale_price: "", status: "Active"
      });
    } else {
      alert("Failed: " + JSON.stringify(data));
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/products/" + id, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    setProducts(prev => prev.filter(p => p.id !== id));
    alert("Product deleted!");
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            backgroundColor: activeTab === "orders" ? "#1a1a2e" : "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            backgroundColor: activeTab === "products" ? "#1a1a2e" : "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Products
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h3>All Orders</h3>
          {orders.length === 0 && <p>No orders found!</p>}
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
                width="80"
                height="80"
                style={{ objectFit: "cover", borderRadius: "5px" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{order.product_name}</h3>
                <p style={{ margin: 0 }}>Order ID: {order.order_id}</p>
                <p style={{ margin: 0 }}>User ID: {order.user_id}</p>
                <p style={{ margin: 0 }}>Quantity: {order.quantity}</p>
                <p style={{ margin: 0, color: "green" }}>Total: ₹{order.total_price}</p>
                <p style={{ margin: 0 }}>
                  Status: <span style={{
                    color: order.status === "Delivered" ? "green" :
                      order.status === "Confirmed" ? "blue" : "orange"
                  }}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <button
                  onClick={() => updateStatus(order.order_id, "Confirmed")}
                  style={{ backgroundColor: "blue", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                >Confirm</button>
                <button
                  onClick={() => updateStatus(order.order_id, "Delivered")}
                  style={{ backgroundColor: "green", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                >Deliver</button>
                <button
                  onClick={() => updateStatus(order.order_id, "Cancelled")}
                  style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                >Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <h3>Add New Product</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
            <input placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input placeholder="Slug (e.g. iphone-15)" value={newProduct.slug} onChange={e => setNewProduct({ ...newProduct, slug: e.target.value })} />
            <input placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} />
            <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            <input placeholder="Base Price" type="number" value={newProduct.base_price} onChange={e => setNewProduct({ ...newProduct, base_price: e.target.value })} />
            <input placeholder="Sale Price" type="number" value={newProduct.sale_price} onChange={e => setNewProduct({ ...newProduct, sale_price: e.target.value })} />
            <button
              onClick={addProduct}
              style={{ backgroundColor: "green", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" }}
            >
              Add Product
            </button>
          </div>

          <h3 style={{ marginTop: "30px" }}>All Products</h3>
          {products.map((product) => (
            <div key={product.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}>
              <img
                src={product.image_url}
                alt={product.name}
                width="80"
                height="80"
                style={{ objectFit: "cover", borderRadius: "5px" }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: 0, textDecoration: "line-through", color: "gray" }}>₹{product.base_price}</p>
                <p style={{ margin: 0, color: "green" }}>₹{product.sale_price}</p>
              </div>
              <button
                onClick={() => deleteProduct(product.id)}
                style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Admin;