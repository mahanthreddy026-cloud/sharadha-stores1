import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../api";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Payment() {
  const { clearCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleConfirmPayment = async () => {
    setError(null);
    setStatus(null);

    if (!orderData || !orderData.cart || orderData.cart.length === 0) {
      setError("Invalid order details. Please return to cart.");
      return;
    }

    if (!paymentMethod) {
      setError("Please choose a payment method.");
      return;
    }

    setLoading(true);
    try {
      await placeOrder({
        customerName: orderData.customerName,
        email: orderData.email,
        address: orderData.address,
        cart: orderData.cart,
        total: orderData.total,
      });
      clearCart();
      setStatus("Your order is confirmed.");
    } catch (err) {
      setError(err.message || "Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No order found. Please add items to the cart and try again.
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/cart")}>Go to Cart</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm p-4 mb-4">
            <h3>Payment Method</h3>
            <p className="text-muted">Select a payment method to complete your order.</p>

            {status && <div className="alert alert-success">{status}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="card"
                value="Credit/Debit Card"
                checked={paymentMethod === "Credit/Debit Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="card">
                Credit/Debit Card
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="upi"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="upi">
                UPI
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="netbanking"
                value="Net Banking"
                checked={paymentMethod === "Net Banking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="netbanking">
                Net Banking
              </label>
            </div>
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cod"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="cod">
                Cash on Delivery
              </label>
            </div>

            <button
              className="btn btn-danger"
              onClick={handleConfirmPayment}
              disabled={loading || !!status}
            >
              {loading ? "Processing..." : status ? "Order Confirmed" : "Confirm Payment"}
            </button>

            {status && (
              <div className="mt-4">
                <p className="fw-bold">Thank you! Your payment method is {paymentMethod}.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>Return Home</button>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4>Order Summary</h4>
            <p className="mb-2">
              <strong>Name:</strong> {orderData.customerName}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {orderData.email}
            </p>
            <p className="mb-2">
              <strong>Address:</strong>
            </p>
            <p className="text-muted">{orderData.address}</p>
            <hr />
            <p className="mb-2">
              <strong>Items:</strong> {orderData.cart.length}
            </p>
            <p className="mb-2">
              <strong>Total:</strong> ₹{orderData.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
