import { useEffect, useState } from "react";
import { getCartItems, removeFromCart, updateCartQuantity } from "../services/api";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getCartItems().then(async (items) => {
      if (Array.isArray(items)) {
        const detailed = await Promise.all(
          items.map(async (item) => {
            const res = await fetch("https://ecommerce-project-1-xbgb.onrender.com/products/" + item.product_id);
            const product = await res.json();
            return {
              ...item,
              name: product.name,
              image_url: product.image_url,
              sale_price: product.sale_price,
              base_price: product.base_price
            };
          })
        );
        setCartProducts(detailed);
      } else {
        setCartProducts([]);
      }
      setLoading(false);
    });
  }, []);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const totalPrice = cartProducts
    .filter(item => selected.includes(item.id))
    .reduce((sum, item) => sum + (parseFloat(item.sale_price) * item.quantity), 0);

  const buySelected = async () => {
    const token = localStorage.getItem("token");
    for (const item of cartProducts) {
      if (selected.includes(item.id)) {
        await fetch(
          "http://127.0.0.1:8000/orders/buy/" + item.product_id + "?quantity=" + item.quantity,
          {
            method: "POST",
            headers: { "Authorization": "Bearer " + token }
          }
        );
      }
    }
    alert("Orders placed for selected items!");
  };

  if (loading) return <h2>Loading cart...</h2>;

  if (cartProducts.length === 0) return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      <p>Cart is empty!</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cartProducts.map((item) => (
        <div key={item.id} style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          border: "1px solid gray",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>

          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
            style={{ width: "20px", height: "20px" }}
          />

          <img
            src={item.image_url}
            alt={item.name}
            width="100"
            height="100"
            style={{ objectFit: "cover", borderRadius: "5px" }}
          />

          <div>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ textDecoration: "line-through", color: "gray", margin: 0 }}>
              ₹{item.base_price}
            </p>
            <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>
              ₹{item.sale_price}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
              <button
                onClick={async () => {
                  const newQty = item.quantity - 1;
                  await updateCartQuantity(item.product_id, newQty);
                  if (newQty <= 0) {
                    setCartProducts(prev => prev.filter(p => p.id !== item.id));
                  } else {
                    setCartProducts(prev =>
                      prev.map(p => p.id === item.id ? { ...p, quantity: newQty } : p)
                    );
                  }
                }}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={async () => {
                  const newQty = item.quantity + 1;
                  await updateCartQuantity(item.product_id, newQty);
                  setCartProducts(prev =>
                    prev.map(p => p.id === item.id ? { ...p, quantity: newQty } : p)
                  );
                }}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={async () => {
                await removeFromCart(item.product_id);
                setCartProducts(prev => prev.filter(p => p.id !== item.id));
              }}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "5px"
              }}
            >
              Remove
            </button>

          </div>

        </div>
      ))}

      {selected.length > 0 && (
        <div style={{ marginTop: "10px" }}>

          <p style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "green"
          }}>
            Selected Total: ₹{totalPrice.toFixed(2)}
          </p>

          <button
            onClick={buySelected}
            style={{
              backgroundColor: "#0077b6",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Buy Selected ({selected.length} items)
          </button>

        </div>
      )}

    </div>
  );
}

export default Cart;