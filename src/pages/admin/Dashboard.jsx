import { useEffect, useState } from "react";
import { fetchAdminReports, isAdmin } from "../../api";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminReports()
      .then((data) => setReports(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">📊 Admin Dashboard</h1>

      {/* Key Metrics */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="card shadow p-4 text-center border-0">
            <div className="display-6 text-danger">🛒</div>
            <h3 className="mt-2">{reports?.totalOrders || 0}</h3>
            <p className="text-muted">Placed Orders</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center border-0">
            <div className="display-6 text-warning">📦</div>
            <h3 className="mt-2">{reports?.totalBulkOrders || 0}</h3>
            <p className="text-muted">Bulk Orders</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center border-0">
            <div className="display-6 text-primary">👥</div>
            <h3 className="mt-2">{reports?.totalCustomers || 0}</h3>
            <p className="text-muted">Customers</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-4 text-center border-0">
            <div className="display-6 text-success">🛍️</div>
            <h3 className="mt-2">{reports?.totalProducts || 0}</h3>
            <p className="text-muted">Products</p>
          </div>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card shadow p-4 border-0">
            <h4>💰 Total Sales</h4>
            <h2 className="text-success display-6">₹{reports?.totalSales?.toFixed(2) || "0.00"}</h2>
            <small className="text-muted">Total revenue from placed orders</small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-12">
          <h4 className="mb-3">⚡ Quick Actions</h4>
        </div>

        <div className="col-md-6 mb-3">
          <Link to="/admin/orders" className="card border-0 shadow p-4 text-decoration-none text-dark hover-shadow">
            <div className="display-6">🛒</div>
            <h5 className="mt-3">View Placed Orders</h5>
            <p className="text-muted">Check all customer orders with items and totals</p>
            <small className="text-primary">Click to manage →</small>
          </Link>
        </div>

        <div className="col-md-6 mb-3">
          <Link to="/admin/bulk-orders" className="card border-0 shadow p-4 text-decoration-none text-dark hover-shadow">
            <div className="display-6">📦</div>
            <h5 className="mt-3">View Bulk Orders</h5>
            <p className="text-muted">Check and manage bulk order requests</p>
            <small className="text-warning">Click to manage →</small>
          </Link>
        </div>

        <div className="col-md-6 mb-3">
          <Link to="/admin/customers" className="card border-0 shadow p-4 text-decoration-none text-dark hover-shadow">
            <div className="display-6">👥</div>
            <h5 className="mt-3">View Customers</h5>
            <p className="text-muted">See all registered customers and their details</p>
            <small className="text-primary">Click to view →</small>
          </Link>
        </div>

        <div className="col-md-6 mb-3">
          <Link to="/admin/products" className="card border-0 shadow p-4 text-decoration-none text-dark hover-shadow">
            <div className="display-6">🛍️</div>
            <h5 className="mt-3">Manage Products</h5>
            <p className="text-muted">View and manage product inventory</p>
            <small className="text-success">Click to manage →</small>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;