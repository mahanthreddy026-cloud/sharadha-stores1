import FeaturedProducts from "../components/FeaturedProducts";

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 text-danger">
        Welcome to Sharadha Gift Portal
      </h1>

      <p className="lead">
        Homemade Sweets • Traditional Snacks • Gift Hampers
      </p>

      <img
        src="https://res.cloudinary.com/da7q66jke/image/upload/v1781925510/Sweets_Box_wurd2i.jpg"
        alt="Sweets"
        className="img-fluid rounded shadow my-4"
      />

      <h2>Our Specialties</h2>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h4>🍬 Homemade Sweets</h4>
            <p>Freshly prepared traditional sweets.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h4>🍘 Homemade Snacks</h4>
            <p>Crispy and delicious traditional snacks.</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h4>🎁 Gift Hampers</h4>
            <p>Customized gift boxes for every occasion.</p>
          </div>
        </div>
      </div>

      <FeaturedProducts />
    </div>
  );
}

export default Home;