import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      console.log("API DATA:", data);
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const addToCart = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://127.0.0.1:8000/Cart/Add?product_id=${id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    const data = await res.json();
    console.log(data);
    alert("Product added to cart");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <h2>Products</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            addToCart={addToCart}
          />
        ))}
      </div>

    </div>
  );
}

export default Home;