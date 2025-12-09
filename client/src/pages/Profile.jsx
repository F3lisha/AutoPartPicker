// src/pages/Profile.jsx

const Profile = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-subtitle">
            Manage your public info, listings, and saved searches.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card">
          <div className="card-title">Basic information</div>
          <p>
            <strong>Display name:</strong> felisha_g
          </p>
          <p>
            <strong>Email:</strong> you@example.com
          </p>
          <p>
            <strong>Role:</strong> Buyer &amp; Seller
          </p>
          <div className="chip-row">
            <span className="chip">Verified email</span>
            <span className="chip">2+ years</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Account snapshot</div>
          <div className="profile-stat-row">
            <span>Active listings</span>
            <span>3</span>
          </div>
          <div className="profile-stat-row">
            <span>Completed sales</span>
            <span>7</span>
          </div>
          <div className="profile-stat-row">
            <span>Average rating</span>
            <span>4.8 ★</span>
          </div>
          <div className="profile-stat-row">
            <span>Reports against you</span>
            <span>0</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Saved searches</h2>
        <div className="stack">
          <div className="card">
            <strong>“Hybrid SUV under 25k”</strong>
            <p className="muted">
              Radius: 50 miles · Source: dealer &amp; private
            </p>
          </div>
          <div className="card">
            <strong>“First car for college student”</strong>
            <p className="muted">Fuel efficient · Under 120k miles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
