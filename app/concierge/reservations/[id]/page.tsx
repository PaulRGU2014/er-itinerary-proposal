import Link from "next/link";

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservationRes = await fetch(
    `http://localhost:3000/api/reservations/${id}`,
    { cache: "no-store" },
  );
  const reservation = await reservationRes.json();

  const proposalsRes = await fetch(
    `http://localhost:3000/api/proposals?reservationId=${id}`,
    { cache: "no-store" },
  );
  const proposals = await proposalsRes.json();

  const proposal = proposals[0] ?? null;

  return (
    <div style={{ padding: 24 }}>
      <h1>Reservation for {reservation.member.name}</h1>
      <p>
        {reservation.destination} — {reservation.villa}
      </p>
      <p>
        {new Date(reservation.arrivalDate).toLocaleDateString()} →{" "}
        {new Date(reservation.departureDate).toLocaleDateString()}
      </p>

      <hr style={{ margin: "24px 0" }} />

      {!proposal && (
        <form action={`/api/proposals`} method="POST">
          <input type="hidden" name="reservationId" value={id} />
          <button type="submit">Create Proposal</button>
        </form>
      )}

      {proposal && (
        <div>
          <h2>Proposal #{proposal.id}</h2>
          <Link href={`/concierge/proposals/${proposal.id}`}>
            Open Proposal Editor →
          </Link>
        </div>
      )}
      <a
        href="/concierge"
        style={{ display: "inline-block", marginBottom: 16 }}
      >
        ← Back to Concierge Home
      </a>
    </div>
  );
}
