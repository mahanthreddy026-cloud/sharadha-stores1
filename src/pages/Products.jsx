import { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { fetchProducts } from "../api";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log("Fetching products from API...");
        const data = await fetchProducts();
        console.log("Products fetched:", data);
        setProducts(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filtered = products.filter((product) => {
    return (
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Our Products</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Search Product"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            <option>Sweets</option>
            <option>Snacks</option>
            <option>Gift</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error}</p>
          <hr />
          <small>Please try refreshing the page or contact support.</small>
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No products available
        </div>
      ) : (
        <>
          <p className="text-muted mb-3">
            Showing {filtered.length} of {products.length} products
          </p>
          <div className="row">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">
                  No products match your search filters.
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
