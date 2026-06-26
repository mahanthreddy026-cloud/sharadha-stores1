import { useEffect, useState } from "react";
import { fetchAdminReports, fetchAdminOrders, isAdmin } from "../../api";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [reports, setReports] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    Promise.all([fetchAdminReports(), fetchAdminOrders()])
      .then(([rep, ord]) => {
        setReports(rep);
        setOrders(ord);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  const avgOrderValue = orders.length > 0 ? (reports?.totalSales / orders.length).toFixed(2) : 0;
  const highestOrder = orders.length > 0 ? Math.max(...orders.map(o => o.total || 0)).toFixed(2) : 0;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">📈 Sales & Analytics Reports</h2>

      {/* Main Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow p-4">
            <p className="text-muted mb-1">Total Sales</p>
            <h3 className="text-success mb-0">₹{reports?.totalSales?.toFixed(2) || "0.00"}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow p-4">
            <p className="text-muted mb-1">Total Orders</p>
            <h3 className="text-primary mb-0">{reports?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow p-4">
            <p className="text-muted mb-1">Average Order Value</p>
            <h3 className="text-info mb-0">₹{avgOrderValue}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow p-4">
            <p className="text-muted mb-1">Highest Order</p>
            <h3 className="text-warning mb-0">₹{highestOrder}</h3>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow p-4">
            <h5 className="mb-3">Customers & Products</h5>
            <p className="mb-2">
              <strong>Total Customers:</strong> {reports?.totalCustomers || 0}
            </p>
            <p className="mb-2">
              <strong>Total Products:</strong> {reports?.totalProducts || 0}
            </p>
            <p className="mb-0">
              <strong>Bulk Orders:</strong> {reports?.totalBulkOrders || 0}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow p-4">
            <h5 className="mb-3">Order Statistics</h5>
            <p className="mb-2">
              <strong>Orders Placed:</strong> {orders.length}
            </p>
            <p className="mb-0">
              <strong>Average Items per Order:</strong>{" "}
              {orders.length > 0
                ? (
                    orders.reduce((sum, o) => sum + (o.cart?.length || 0), 0) /
                    orders.length
                  ).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 shadow">
            <div className="card-header bg-light p-3">
              <h5 className="mb-0">Recent Orders (Last 5)</h5>
            </div>
            <div className="card-body p-0">
              {orders.length === 0 ? (
                <p className="p-3 mb-0 text-muted">No orders yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(-5).reverse().map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customerName}</td>
                          <td>{order.cart?.length || 0} items</td>
                          <td className="text-success fw-bold">
                            ₹{order.total?.toFixed(2) || "0.00"}
                          </td>
                          <td className="text-muted small">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;