import { useNavigate } from "react-router-dom";
import { buyNow } from "../services/api";

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    const res = await buyNow(product.id);
    if (res.order_id) {
      alert(`Order placed! Order ID: ${res.order_id}`);
    } else {
      alert(res.detail || "Order failed");
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        border: "1px solid gray",
        padding: "10px",
        width: "200px",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      <img
        src={product.image_url}
        alt={product.name}
        width="180"
        height="180"
        style={{ objectFit: "cover" }}
      />

      <h3>{product.name}</h3>

      <p style={{ textDecoration: "line-through", color: "gray" }}>
        ₹{product.base_price}
      </p>

      <p style={{ color: "green", fontWeight: "bold" }}>
        ₹{product.sale_price}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product.id);
        }}
        style={{ marginRight: "8px" }}
      >
        Add To Cart
      </button>

      <button
        onClick={handleBuyNow}
        style={{
          backgroundColor: "Blue",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Buy Now
      </button>

    </div>
  );
}

export default ProductCard;