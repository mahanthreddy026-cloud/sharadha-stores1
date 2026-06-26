import { Link, useNavigate } from "react-router-dom";
import { getToken, isAdmin, logout } from "../api";

function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">

        <Link className="navbar-brand" to="/">
          🍬 Sharadha Gift Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/bulk-order">
                Bulk Order
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                🛒 Cart
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {admin && (
              <li className="nav-item ms-2">
                <Link className="btn btn-info btn-sm" to="/admin/dashboard">
                  Admin Panel
                </Link>
              </li>
            )}

            {token ? (
              <>
                <li className="nav-item dropdown ms-2">
                  <button
                    className="nav-link dropdown-toggle btn text-white"
                    id="navbarDropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    ⚙️ Account
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/change-password">
                        🔐 Change Password
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-light" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <Link className="btn btn-warning text-dark fw-bold" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;