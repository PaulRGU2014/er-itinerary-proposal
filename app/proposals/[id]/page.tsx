export default async function MemberProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/proposals/${id}`, {
    cache: "no-store",
  });
  const proposal = await res.json();

  const reservation = proposal.reservation;

  // Group items by date
  const itemsByDate: Record<string, any[]> = {};
  for (const item of proposal.items) {
    const date = new Date(item.scheduledAt)
      .toISOString()
      .split("T")[0]; // YYYY-MM-DD
    if (!itemsByDate[date]) itemsByDate[date] = [];
    itemsByDate[date].push(item);
  }

  const sortedDates = Object.keys(itemsByDate).sort();

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <h1>Your Exclusive Resorts Itinerary</h1>

      <h2>{reservation.destination}</h2>
      <p>
        {reservation.villa}
        <br />
        {new Date(reservation.arrivalDate).toLocaleDateString()} →{" "}
        {new Date(reservation.departureDate).toLocaleDateString()}
      </p>

      <hr style={{ margin: "32px 0" }} />

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 12 }}>
            {new Date(date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {itemsByDate[date].map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <strong>{item.title}</strong>
                <br />
                <span style={{ color: "#555" }}>
                  {new Date(item.scheduledAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                {item.description && (
                  <p style={{ marginTop: 4, color: "#666" }}>{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {sortedDates.length === 0 && (
        <p>No itinerary items have been added yet.</p>
      )}
    </div>
  );
}
