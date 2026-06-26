function ProductCard({ product, onAdd }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow">

       <img
  src={product.image}
  alt={product.name}
  className="card-img-top"
  style={{
    height: "250px",
    objectFit: "cover",
  }}
/>

        <div className="card-body">

          <h4>{product.name}</h4>

          <p>{product.category}</p>

          <h5>₹ {product.price}</h5>

          <button
            className="btn btn-danger w-100"
            onClick={() => onAdd(product)}
          >
            Add To Cart
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;