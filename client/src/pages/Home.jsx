// src/pages/Home.jsx
const Home = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome to AutoPartPicker</h1>
          <p className="page-subtitle">
            Compare listings, vet sellers, and keep your vehicle history in one place.
          </p>
        </div>
      </div>

      <div className="section">
        <h2>What you can do here</h2>
        <p className="muted">
          This prototype shows the core flows your users will rely on most
          often when shopping for vehicles or parts.
        </p>
        <div className="listings-grid" style={{ marginTop: "1.5rem" }}>
          <div className="listing-card">
            <h3>Browse & Compare</h3>
            <p className="muted">
              Scroll through dealer and private seller listings and quickly compare
              pricing, trim, and condition.
            </p>
          </div>
          <div className="listing-card">
            <h3>Check History</h3>
            <p className="muted">
              View ownership count, seller reputation, and any alerts tied to a vehicle
              before you reach out.
            </p>
          </div>
          <div className="listing-card">
            <h3>Stay in Control</h3>
            <p className="muted">
              Message sellers, leave reviews, and file reports when something doesn&apos;t
              feel right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
