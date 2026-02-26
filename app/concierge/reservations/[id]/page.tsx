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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/concierge"
          className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Concierge Home
        </Link>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6">
            <h1 className="text-3xl font-bold text-white">
              Reservation for {reservation.member.name}
            </h1>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <p className="text-slate-700">
                <span className="font-semibold">Destination:</span>{" "}
                {reservation.destination} — {reservation.villa}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Dates:</span>{" "}
                {new Date(reservation.arrivalDate).toLocaleDateString()} →{" "}
                {new Date(reservation.departureDate).toLocaleDateString()}
              </p>
            </div>

            <div className="my-6 border-t border-slate-200"></div>

            {!proposal && (
              <form action={`/api/proposals`} method="POST">
                <input type="hidden" name="reservationId" value={id} />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Create Proposal
                </button>
              </form>
            )}

            {proposal && (
              <div>
                <h2 className="mb-3 text-xl font-bold text-slate-900">
                  Proposal #{proposal.id}
                </h2>
                <Link
                  href={`/concierge/proposals/${proposal.id}`}
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Open Proposal Editor →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
