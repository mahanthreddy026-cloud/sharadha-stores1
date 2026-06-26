import { Link } from "react-router-dom";
import { isAdmin } from "../api";

function AdminNav() {
  if (!isAdmin()) return null;

  return (
    <div className="bg-dark text-light py-3 mb-4">
      <div className="container">
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">
            📊 Dashboard
          </Link>
          <Link to="/admin/products" className="btn btn-outline-light btn-sm">
            🛍️ Products
          </Link>
          <Link to="/admin/customers" className="btn btn-outline-light btn-sm">
            👥 Customers
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-light btn-sm">
            🛒 Orders
          </Link>
          <Link to="/admin/bulk-orders" className="btn btn-outline-light btn-sm">
            📦 Bulk Orders
          </Link>
          <Link to="/admin/reports" className="btn btn-outline-light btn-sm">
            📈 Reports
          </Link>
          <Link to="/admin/manage-admins" className="btn btn-outline-warning btn-sm">
            👑 Manage Admins
          </Link>
          <Link to="/" className="btn btn-outline-light btn-sm ms-auto">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
