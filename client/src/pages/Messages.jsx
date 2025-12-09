// src/pages/Messages.jsx

const conversations = [
  {
    id: 1,
    name: "Alex M.",
    preview: "Is the Camry still available?",
    time: "2h ago",
  },
  {
    id: 2,
    name: "Jordan R.",
    preview: "Can you send a photo of the interior?",
    time: "Yesterday",
  },
  {
    id: 3,
    name: "Taylor’s Auto Group",
    preview: "We can hold the car until Friday.",
    time: "Mon",
  },
];

const Messages = () => {
  const active = conversations[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Messages</h1>
          <p className="page-subtitle">
            Keep buyer and seller conversations in one place.
          </p>
        </div>
      </div>

      <div className="messages-container">
        <div className="conversation-list">
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Conversations
          </h2>
          {conversations.map((c, idx) => (
            <div
              key={c.id}
              className={
                "conversation-item" + (idx === 0 ? " active" : "")
              }
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div className="muted">{c.preview}</div>
              <div className="muted" style={{ fontSize: "0.8rem" }}>
                {c.time}
              </div>
            </div>
          ))}
        </div>

        <div className="message-thread">
          <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            Chat with {active.name}
          </h2>
          <div className="stack">
            <div className="card">
              <div className="muted" style={{ marginBottom: "0.25rem" }}>
                You · 1h ago
              </div>
              <p>
                Hi! Yes, the car is still available. Are you free to see it this
                weekend?
              </p>
            </div>
            <div className="card">
              <div className="muted" style={{ marginBottom: "0.25rem" }}>
                {active.name} · 45m ago
              </div>
              <p>
                Saturday afternoon works great for me. Could you share the exact
                address?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
