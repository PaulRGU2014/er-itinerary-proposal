import Link from "next/link";

interface ProposalItem {
  id: number;
  price: number;
}

interface Proposal {
  id: number;
  status: string;
  createdAt: string;
  sentAt: string | null;
  items: ProposalItem[];
}

export default async function ConciergeDashboard() {
  const reservationsRes = await fetch("http://localhost:3000/api/reservations", {
    cache: "no-store",
  });
  const reservations = await reservationsRes.json();
  const reservation = Array.isArray(reservations) ? reservations[0] : reservations;

  const proposalsRes = await fetch("http://localhost:3000/api/proposals", {
    cache: "no-store",
  });
  const proposals = await proposalsRes.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Concierge Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Manage itinerary proposals for Exclusive Resorts members
          </p>
        </div>

        {/* Current Reservation */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Current Reservation
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {reservation.member.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {reservation.member.email}
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-slate-700">
                    <span className="font-semibold">Destination:</span>{" "}
                    {reservation.destination}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold">Villa:</span>{" "}
                    {reservation.villa}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold">Dates:</span>{" "}
                    {new Date(reservation.arrivalDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(reservation.departureDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Link
                href={`/concierge/reservations/${reservation.id}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">
              All Proposals
            </h2>
          </div>
          <div className="p-6">
            {proposals.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-600">No proposals created yet.</p>
                <Link
                  href={`/concierge/reservations/${reservation.id}`}
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Create First Proposal
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal: Proposal) => {
                  const total = proposal.items.reduce(
                    (sum: number, item: ProposalItem) => sum + item.price,
                    0
                  );
                  
                  const statusColors = {
                    DRAFT: "bg-gray-100 text-gray-800",
                    SENT: "bg-blue-100 text-blue-800",
                    APPROVED: "bg-green-100 text-green-800",
                    PAID: "bg-purple-100 text-purple-800",
                  };

                  return (
                    <div
                      key={proposal.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Proposal #{proposal.id}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusColors[proposal.status as keyof typeof statusColors]
                            }`}
                          >
                            {proposal.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {proposal.items.length} items • ${total.toFixed(2)} total
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Created {new Date(proposal.createdAt).toLocaleDateString()}
                          {proposal.sentAt && (
                            <> • Sent {new Date(proposal.sentAt).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/proposals/${proposal.id}`}
                          target="_blank"
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/concierge/proposals/${proposal.id}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
