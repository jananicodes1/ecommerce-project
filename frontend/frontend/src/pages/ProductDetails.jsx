import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, buyNow } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();

  useEffect(() => {
    getProductById(id).then(data => setProduct(data));
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://127.0.0.1:8001/Cart/Add?product_id=${id}`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    const data = await res.json();
    alert("Added to cart!");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>

      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        ← Back
      </button>

      {product && (
        <>
          <img
            src={product.image_url}
            alt={product.name}
            width="300"
            style={{ borderRadius: "10px" }}
          />

          <h1>{product.name}</h1>

          <p style={{ color: "gray" }}>{product.description}</p>

          <p style={{
            textDecoration: "line-through",
            color: "gray"
          }}>
            ₹{product.base_price}
          </p>

          <p style={{
            color: "green",
            fontWeight: "bold",
            fontSize: "24px"
          }}>
            ₹{product.sale_price}
          </p>

          <button
            onClick={addToCart}
            style={{
              backgroundColor: "#1a1a2e",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Add To Cart 🛒
          </button>

          <button
  onClick={async () => {
    const res = await buyNow(id);
    if (res.order_id) {
      alert(`Order placed! Order ID: ${res.order_id}`);
    } else {
      alert(res.detail || "Order failed");
    }
  }}
  style={{
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px"
  }}
>
  Buy Now 🛍️
</button>
        </>
      )}
    </div>
  );
}

export default ProductDetails;