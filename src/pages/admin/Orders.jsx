import { useEffect, useState } from "react";
import { fetchAdminOrders, isAdmin, updateOrderStatus } from "../../api";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      setOrders(updatedOrders);
      setExpandedId(null);
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛒 Placed Orders</h2>
        <span className="badge bg-success">{orders.length} Total</span>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders placed yet</div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
              <div className="card-header bg-success bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Order #{order.id}</h5>
                  <span className={`badge bg-${order.status === 'confirmed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <strong>👤 Customer:</strong> {order.customerName}
                  </p>
                  <p className="mb-2">
                    <strong>📧 Email:</strong>{" "}
                    <a href={`mailto:${order.email}`}>{order.email}</a>
                  </p>
                  <p className="mb-3">
                    <strong>🏠 Address:</strong>
                    <br />
                    <span className="text-muted">{order.address}</span>
                  </p>
                  <hr />

                  <p className="mb-2">
                    <strong>📦 Items ({order.cart?.length || 0}):</strong>
                  </p>
                  {order.cart && order.cart.length > 0 ? (
                    <div className="ps-3">
                      {order.cart.map((item, idx) => (
                        <div key={idx} className="mb-2 border-bottom pb-2">
                          <p className="mb-1">
                            <strong>{item.name}</strong>
                            {item.quantity && (
                              <span className="ms-2 badge bg-info">
                                Qty: {item.quantity}
                              </span>
                            )}
                          </p>
                          <p className="mb-0 text-muted small">
                            ₹{item.price?.toFixed(2)} per item
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ps-3 text-muted">No items</p>
                  )}

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Total Amount:</strong>
                    <span className="text-success fs-5">
                      ₹{order.total?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <p className="mb-0 small text-muted">
                    <strong>📅 Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="card-footer bg-light border-0">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() =>
                      setExpandedId(expandedId === order.id ? null : order.id)
                    }
                  >
                    {expandedId === order.id ? "Hide" : "Show"} Actions
                  </button>
                  {expandedId === order.id && (
                    <div className="mt-2">
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleStatusUpdate(order.id, "confirmed")}
                        disabled={actionLoading === order.id}
                      >
                        ✓ Confirm
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleStatusUpdate(order.id, "pending")}
                        disabled={actionLoading === order.id}
                      >
                        ⏱ Pending
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(order.id, "cancelled")}
                        disabled={actionLoading === order.id}
                      >
                        ✕ Cancel
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

export default Orders;
