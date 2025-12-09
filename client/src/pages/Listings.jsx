// src/pages/Listings.jsx
import { useState, useEffect } from "react";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:3000/listings");
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setListings(data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Could not load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div className="page">Loading listings...</div>;
  if (error) return <div className="page">{error}</div>;

  return (
    <div className="page">
      <h1>Vehicle Listings</h1>
      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing.listing_id} className="listing-card">
            <h3>{listing.title}</h3>
            <p>Price: ${listing.price}</p>
            <p>Status: {listing.status}</p>
            <p>Source: {listing.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
