import { useState } from "react";
import { sendBulkOrder } from "../api";

function BulkOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    try {
      const response = await sendBulkOrder({ name, phone, details });
      setStatus(response.message);
      setName("");
      setPhone("");
      setDetails("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-danger">Bulk Order</h1>

      <p className="lead">
        Place bulk orders for weddings, offices, functions, festivals, and return gifts.
      </p>

      {status && <div className="alert alert-success">{status}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Order Details</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Describe your bulk order"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-danger">
          Submit Bulk Order
        </button>
      </form>
    </div>
  );
}

export default BulkOrder;
