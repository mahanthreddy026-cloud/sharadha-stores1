import { useEffect, useState } from "react";
import { fetchAdminProducts, isAdmin } from "../../api";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  return (
    <div className="container mt-5">
      <h2>Manage Products</h2>

      <button className="btn btn-success mb-3">Add Product</button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>
                <button className="btn btn-warning btn-sm">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProducts;