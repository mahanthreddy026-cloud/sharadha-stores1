import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const {
    cart,
    increase,
    decrease,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!name || !email || !address) {
      setError("Please provide name, email, and delivery address.");
      return;
    }

    navigate("/payment", {
      state: {
        customerName: name,
        email,
        address,
        cart,
        total,
      },
    });
  };

  return (
    <div className="container mt-5 mb-5">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">No Products Added</div>
      ) : (
        <>
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => decrease(item.id)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => increase(item.id)}
                    >
                      +
                    </button>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card p-4 shadow-sm mb-4">
                <h4>Delivery Information</h4>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, city, state, postal code"
                  ></textarea>
                </div>
                <button
                  className="btn btn-danger w-100"
                  onClick={handleOrder}
                  disabled={loading}
                >
                  {loading ? "Preparing Payment..." : "Pay Now"}
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-4 shadow-sm">
                <h4>Order Summary</h4>
                <p className="mb-2">
                  <strong>Items:</strong> {cart.length}
                </p>
                <p>
                  <strong>Grand Total:</strong> ₹{total}
                </p>
                <button
                  className="btn btn-secondary w-100"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;