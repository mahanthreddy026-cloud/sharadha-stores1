import { useContext, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { CartContext } from "../context/CartContext";
import { fetchProducts } from "../api";

function FeaturedProducts() {
  const cartContext = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safely get addToCart function, provide fallback
  const addToCart = cartContext?.addToCart || (() => {});

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load featured products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <div className="container mt-5 text-center">Loading products...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">Best Selling Products</h2>

      {products.length === 0 ? (
        <div className="alert alert-info text-center">No products available</div>
      ) : (
        <div className="row">
          {products.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeaturedProducts;