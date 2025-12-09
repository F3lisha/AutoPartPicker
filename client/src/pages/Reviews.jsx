// src/pages/Reviews.jsx

const myReceivedReviews = [
  {
    id: 1,
    reviewer: "Alex M.",
    rating: 5,
    summary: "Easy to work with",
    body: "Super responsive and honest about the car’s condition. Would buy from again.",
    date: "Dec 2, 2025",
  },
  {
    id: 2,
    reviewer: "Jordan R.",
    rating: 4,
    summary: "Smooth transaction",
    body: "Pickup was quick and paperwork was ready. Small cosmetic scratch not mentioned, but nothing major.",
    date: "Nov 27, 2025",
  },
];

const myWrittenReviews = [
  {
    id: 3,
    reviewee: "Taylor’s Auto Group",
    rating: 5,
    summary: "Great dealer experience",
    body: "They shared the full history report upfront and didn’t push add-ons I didn’t want.",
    date: "Nov 15, 2025",
  },
];

const Reviews = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reviews</h1>
          <p className="page-subtitle">
            See what buyers say about you and track the reviews you leave for others.
          </p>
        </div>
      </div>

      <div className="section">
        <h2>Reviews about you</h2>
        <div className="stack">
          {myReceivedReviews.map((r) => (
            <div key={r.id} className="card">
              <div className="review-header">
                <div>
                  <strong>{r.reviewer}</strong>
                  <div className="muted">{r.date}</div>
                </div>
                <div className="review-rating">{"★".repeat(r.rating)}</div>
              </div>
              <div>
                <strong>{r.summary}</strong>
                <p className="muted" style={{ marginTop: "0.35rem" }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Reviews you&apos;ve written</h2>
        <div className="stack">
          {myWrittenReviews.map((r) => (
            <div key={r.id} className="card">
              <div className="review-header">
                <div>
                  <strong>{r.reviewee}</strong>
                  <div className="muted">{r.date}</div>
                </div>
                <div className="review-rating">{"★".repeat(r.rating)}</div>
              </div>
              <div>
                <strong>{r.summary}</strong>
                <p className="muted" style={{ marginTop: "0.35rem" }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
