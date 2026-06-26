import { useEffect, useState } from "react";
import { fetchAdminBulkOrders, isAdmin } from "../../api";
import { useNavigate } from "react-router-dom";

function BulkOrders() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminBulkOrders()
      .then((data) => setBulkOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Bulk Order Requests</h2>
        <span className="badge bg-info">{bulkOrders.length} Total</span>
      </div>

      {bulkOrders.length === 0 ? (
        <div className="alert alert-info">No bulk orders yet</div>
      ) : (
        <div className="row">
          {bulkOrders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-warning bg-opacity-10 border-0">
                  <h5 className="mb-0">Order #{order.id}</h5>
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <strong>👤 Customer:</strong> {order.name}
                  </p>
                  <p className="mb-2">
                    <strong>📞 Phone:</strong>{" "}
                    <a href={`tel:${order.phone}`}>{order.phone}</a>
                  </p>
                  <p className="mb-2">
                    <strong>📋 Details:</strong>
                  </p>
                  <p className="ps-3 text-muted">{order.details}</p>
                  <p className="mb-0">
                    <strong>📅 Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="card-footer bg-light border-0">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    {expandedId === order.id ? "Hide" : "Show"} Actions
                  </button>
                  {expandedId === order.id && (
                    <div className="mt-2">
                      <button className="btn btn-success btn-sm me-2">
                        ✓ Approve
                      </button>
                      <button className="btn btn-danger btn-sm">
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BulkOrders;