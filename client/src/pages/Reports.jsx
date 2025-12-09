// src/pages/Reports.jsx

const myReports = [
  {
    id: 1,
    target: "Listing: 2012 Civic LX",
    status: "Open",
    reason: "Odometer reading seems inconsistent with photos.",
    date: "Nov 20, 2025",
  },
  {
    id: 2,
    target: "User: fastflip_cars",
    status: "Resolved",
    reason: "Listing was duplicated multiple times.",
    date: "Nov 5, 2025",
  },
];

const Reports = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="page-subtitle">
            File a report when something feels off and track the status of past reports.
          </p>
        </div>
      </div>

      <div className="section">
        <h2>File a new report</h2>
        <div className="card">
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            This form is visual only in the prototype. In the final build, it
            will submit through the API.
          </p>
          <input placeholder="Link to listing or username" />
          <textarea rows={3} placeholder="Describe what happened..." />
          <button>Submit report</button>
        </div>
      </div>

      <div className="section">
        <h2>My reports</h2>
        <div className="stack">
          {myReports.map((r) => (
            <div key={r.id} className="card">
              <div className="report-header">
                <div>
                  <strong>{r.target}</strong>
                  <div className="muted">{r.date}</div>
                </div>
                <span className="badge badge-pill">{r.status}</span>
              </div>
              <p className="muted">{r.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
