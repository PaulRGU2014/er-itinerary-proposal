import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

interface ProposalItem {
  id: number;
  price: number;
}

interface Proposal {
  id: number;
  status: string;
  createdAt: Date;
  sentAt: Date | null;
  items: ProposalItem[];
}

export default async function ConciergeDashboard() {
  const reservations = await prisma.reservation.findMany({
    include: {
      member: true,
    },
    orderBy: { arrivalDate: "asc" },
  });

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-lora text-lg text-[#666666]">No reservations found.</p>
        </div>
      </div>
    );
  }

  const proposals = await prisma.proposal.findMany({
    include: {
      reservation: {
        include: { member: true },
      },
      items: true,
      guests: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
          href="/"
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
          <span>Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-playfair text-5xl text-[#2c2416] mb-4">
            Concierge Dashboard
          </h1>
          <p className="font-lora text-lg text-[#8b8680]">
            Manage expertly curated itinerary proposals for our distinguished members
          </p>
        </div>

        {/* Reservations Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm hover:shadow-lg transition-all"
            >
              <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-6 py-4">
                <h3 className="font-playfair text-xl text-[#2c2416]">
                  {reservation.member.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#8b8680] font-lato uppercase tracking-wide mb-4">
                  {reservation.member.email}
                </p>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-[#8b8680] font-lato uppercase tracking-wide">Destination</p>
                    <p className="font-lora text-lg text-[#2c2416]">{reservation.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b8680] font-lato uppercase tracking-wide">Villa</p>
                    <p className="font-lora text-sm text-[#2c2416]">{reservation.villa}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8b8680] font-lato uppercase tracking-wide">Dates</p>
                    <p className="font-lora text-sm text-[#2c2416]">
                      {new Date(reservation.arrivalDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      –{" "}
                      {new Date(reservation.departureDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/concierge/reservations/${reservation.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-black text-white font-lato text-xs font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-lg"
                >
                  View & Manage
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Proposals Section */}
        <div className="overflow-hidden rounded-lg bg-white border border-[#f0f0f0] shadow-sm">
          <div className="border-b border-[#f0f0f0] bg-[#f8f8f8] px-8 py-6">
            <h2 className="font-playfair text-2xl text-black">
              All Proposals
            </h2>
          </div>
          <div className="p-8">
            {proposals.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-lora text-lg text-[#666666] mb-6">No proposals created yet.</p>
                <p className="font-lora text-sm text-[#8b8680]">Start by selecting a reservation above to create the first proposal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal: Proposal) => {
                  const total = proposal.items.reduce(
                    (sum: number, item: ProposalItem) => sum + item.price,
                    0
                  );
                  
                  const statusColors = {
                    DRAFT: "bg-[#f5f3f0] text-[#8b8680] border-[#e8e4df]",
                    SENT: "bg-[#e8e4df] text-[#2c2416] border-[#d4af37]",
                    APPROVED: "bg-[#d4af37]/10 text-[#a3860f] border-[#d4af37]",
                    PAID: "bg-[#d4af37]/20 text-[#2c2416] border-[#d4af37]",
                  };

                  return (
                    <div
                      key={proposal.id}
                      className={`flex items-center justify-between rounded-lg border p-6 transition-all hover:shadow-md ${statusColors[proposal.status as keyof typeof statusColors]}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-playfair text-xl text-[#2c2416]">
                            Proposal #{proposal.id}
                          </h3>
                          <span className="font-lato text-xs uppercase tracking-wider px-3 py-1 border">
                            {proposal.status}
                          </span>
                        </div>
                        <p className="font-lora text-sm text-[#8b8680] mb-2">
                          {proposal.items.length} items • ${total.toFixed(2)} total
                        </p>
                        <p className="text-xs text-[#8b8680]">
                          Created {new Date(proposal.createdAt).toLocaleDateString()}
                          {proposal.sentAt && (
                            <> • Sent {new Date(proposal.sentAt).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/proposals/${proposal.id}`}
                          target="_blank"
                          className="px-4 py-2 border border-black text-black font-lato text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/concierge/proposals/${proposal.id}`}
                          className="px-4 py-2 bg-black text-white font-lato text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-2xl"
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
