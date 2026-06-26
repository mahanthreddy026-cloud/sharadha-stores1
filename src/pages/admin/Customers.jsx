import { useEffect, useState } from "react";
import { fetchAdminCustomers, isAdmin } from "../../api";
import { useNavigate } from "react-router-dom";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminCustomers()
      .then((data) => setCustomers(data.filter((u) => u.role !== "admin")))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  return (
    <div className="container mt-5">
      <h2>Customers</h2>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;