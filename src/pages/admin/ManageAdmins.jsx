import { useEffect, useState } from "react";
import { fetchAdminCustomers, isAdmin, makeAdmin, removeAdmin } from "../../api";
import { useNavigate } from "react-router-dom";

function ManageAdmins() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
    fetchAdminCustomers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleMakeAdmin = async (userId, userName) => {
    setActionMessage(null);
    setActionError(null);
    try {
      const response = await makeAdmin(userId);
      setActionMessage(response.message);
      // Update local state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: "admin" } : u))
      );
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleRemoveAdmin = async (userId, userName) => {
    setActionMessage(null);
    setActionError(null);
    try {
      const response = await removeAdmin(userId);
      setActionMessage(response.message);
      // Update local state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: "customer" } : u))
      );
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;
  if (error) return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;

  const admins = users.filter((u) => u.role === "admin");
  const customers = users.filter((u) => u.role === "customer");

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">👥 Manage Admin Users</h2>

      {actionMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {actionMessage}
          <button type="button" className="btn-close" onClick={() => setActionMessage(null)}></button>
        </div>
      )}
      {actionError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {actionError}
          <button type="button" className="btn-close" onClick={() => setActionError(null)}></button>
        </div>
      )}

      {/* Current Admins */}
      <div className="row mb-5">
        <div className="col-md-12">
          <h4 className="mb-3">
            👑 Current Admins ({admins.length})
          </h4>

          {admins.length === 0 ? (
            <div className="alert alert-info">No admin users yet</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover border">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>👑 {user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="text-muted small">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {admins.length > 1 ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveAdmin(user.id, user.name)}
                          >
                            Remove Admin
                          </button>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Last Admin
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Users - Can Promote */}
      <div className="row">
        <div className="col-md-12">
          <h4 className="mb-3">
            👤 Customer Users ({customers.length})
          </h4>

          {customers.length === 0 ? (
            <div className="alert alert-info">All users are admins</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover border">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="text-muted small">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleMakeAdmin(user.id, user.name)}
                        >
                          Make Admin
                        </button>
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
  );
}

export default ManageAdmins;
