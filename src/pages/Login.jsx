import { useState } from "react";
import { loginUser, isAdmin } from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const response = await loginUser({ email, password });
      setStatus(response.message);
      setEmail("");
      setPassword("");
      
      // Redirect admin users to dashboard
      setTimeout(() => {
        if (isAdmin()) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>

      {status && <div className="alert alert-success">{status}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-danger w-100">
          Login
        </button>
      </form>

      <hr />
      <small className="text-muted">
        Demo Admin: admin@local / admin123
      </small>
    </div>
  );
}

export default Login;
