import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: "10px 20px",
        backgroundColor: "#1a1a2e",
        color: "white",
        gap: "10px",
      }}
    >
      <h2 style={{ margin: 0, color: "white" }}>E-Commerce</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
        <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>Cart 🛒</Link>
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>Orders</Link>
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>Admin</Link>

        <button
          onClick={logout}
          style={{
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;