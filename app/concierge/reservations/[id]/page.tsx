import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(id) },
    include: {
      member: true,
    },
  });

  if (!reservation) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-lora text-lg text-[#666666]">Reservation not found.</p>
        </div>
      </div>
    );
  }

  const proposals = await prisma.proposal.findMany({
    where: { reservationId: reservation.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const proposal = proposals[0] ?? null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#f0f0f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-6 py-6">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span className="text-white font-playfair text-lg font-bold">E</span>
            </div>
            <span className="font-playfair text-xl tracking-wider text-black">EXCLUSIVE RESORTS</span>
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Back Button */}
        <Link
          href="/concierge"
          className="mb-8 inline-flex items-center gap-2 px-6 py-3 text-[#666666] font-lato text-sm uppercase tracking-wide border border-[#f0f0f0] transition-all duration-300 hover:text-black hover:border-black hover:bg-[#f8f8f8]"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </Link>

        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-playfair text-5xl text-[#2c2416] mb-4">
            Reservation
          </h1>
          <p className="font-lora text-lg text-[#8b8680]">
            {reservation.member.name}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
          <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-8 py-6">
            <h2 className="font-playfair text-2xl text-[#2c2416]">
              Reservation Details
            </h2>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              <p className="font-lora text-[#2c2416]">
                <span className="font-semibold">Destination:</span>{" "}
                {reservation.destination} — {reservation.villa}
              </p>
              <p className="font-lora text-[#2c2416]">
                <span className="font-semibold">Dates:</span>{" "}
                {new Date(reservation.arrivalDate).toLocaleDateString()} →{" "}
                {new Date(reservation.departureDate).toLocaleDateString()}
              </p>
            </div>

            <div className="my-8 border-t border-[#e8e4df]"></div>

            {!proposal && (
              <form action={`/api/proposals`} method="POST">
                <input type="hidden" name="reservationId" value={id} />
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white font-lato font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  Create Proposal
                </button>
              </form>
            )}

            {proposal && (
              <div>
                <h3 className="mb-6 font-playfair text-2xl text-[#2c2416]">
                  Proposal #{proposal.id}
                </h3>
                <Link
                  href={`/concierge/proposals/${proposal.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-lato font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  Open Proposal Editor
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
