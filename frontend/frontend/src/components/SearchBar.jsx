function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          borderRadius: "5px",
          border: "1px solid gray"
        }}
      />
    </div>
  );
}

export default SearchBar;