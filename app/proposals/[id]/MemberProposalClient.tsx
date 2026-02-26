"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProposalItem {
  id: number;
  category: string;
  title: string;
  description: string;
  scheduledAt: string;
  price: number;
}

interface Proposal {
  id: number;
  status: string;
  items: ProposalItem[];
  reservation: {
    id: number;
    destination: string;
    villa: string;
    arrivalDate: string;
    departureDate: string;
    member: {
      name: string;
      email: string;
    };
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  Dining: "🍽️",
  Activities: "🏄",
  Wellness: "💆",
  Excursions: "⛵",
  Transport: "🚗",
  Experiences: "🌅",
};

export default function MemberProposalClient({ proposal }: { proposal: Proposal }) {
  const router = useRouter();
  const [status, setStatus] = useState(proposal.status);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const reservation = proposal.reservation;

  // Group items by date
  const itemsByDate: Record<string, ProposalItem[]> = {};
  for (const item of proposal.items) {
    const date = new Date(item.scheduledAt).toISOString().split("T")[0];
    if (!itemsByDate[date]) itemsByDate[date] = [];
    itemsByDate[date].push(item);
  }

  const sortedDates = Object.keys(itemsByDate).sort();

  // Calculate total cost
  const totalCost = proposal.items.reduce(
    (sum: number, item: ProposalItem) => sum + item.price,
    0
  );

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      if (res.ok) {
        setStatus("APPROVED");
      }
    } catch (error) {
      console.error("Error approving proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (res.ok) {
        setStatus("PAID");
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg border border-[#f0f0f0] shadow-lg p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d4af37]/10 border border-[#d4af37] mb-6">
              <svg
                className="w-10 h-10 text-[#d4af37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-playfair text-5xl text-black mb-4 leading-tight">
              Your Itinerary is Confirmed
            </h1>
            <p className="font-lora text-lg text-[#666666] mb-8">
              We&apos;ve received your payment and locked in your exclusive experiences.
            </p>
          </div>

          <div className="bg-[#f8f8f8] border border-[#f0f0f0] rounded-lg p-8 mb-8">
            <div className="text-xs font-lato uppercase tracking-[2px] text-[#666666] mb-3">
              Confirmation Details
            </div>
            <h2 className="font-playfair text-3xl text-black mb-6">
              {reservation.destination}
            </h2>
            <div className="space-y-3 text-left">
              <p className="font-lora text-black">
                <span className="font-semibold">Guest:</span> {reservation.member.name}
              </p>
              <p className="font-lora text-black">
                <span className="font-semibold">Villa:</span> {reservation.villa}
              </p>
              <p className="font-lora text-black">
                <span className="font-semibold">Dates:</span>{" "}
                {new Date(reservation.arrivalDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(reservation.departureDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="font-lora text-black">
                <span className="font-semibold">Total Investment:</span> ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>

          <p className="font-lora text-[#666666]">
            A detailed confirmation has been sent to{" "}
            <span className="font-semibold text-black">{reservation.member.email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-12 inline-flex items-center gap-2 px-6 py-3 text-[#666666] font-lato text-sm uppercase tracking-wide border border-[#f0f0f0] transition-all duration-300 hover:text-black hover:border-black hover:bg-[#f8f8f8]"
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
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent"></div>
            <span className="font-lato text-xs tracking-[2px] text-[#8b8680] uppercase">Your Experience</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-[#d4af37] to-transparent"></div>
          </div>
          <h1 className="font-playfair text-5xl text-[#2c2416] mb-4 leading-tight">
            Your Curated Itinerary
          </h1>
          <p className="font-lora text-lg text-[#8b8680]">
            A personalized experience crafted exclusively for you
          </p>
        </div>

        {/* Reservation Details Card */}
        <div className="mb-12 overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
          <div className="bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] border-b border-[#e8e4df] px-8 py-8">
            <h2 className="font-playfair text-4xl text-[#2c2416] mb-2">
              {reservation.destination}
            </h2>
            <p className="font-lora text-[#8b8680]">{reservation.villa}</p>
          </div>
          <div className="px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato text-xs uppercase tracking-[2px] text-[#8b8680] mb-3">
                  Arrival
                </p>
                <p className="font-playfair text-2xl text-[#2c2416]">
                  {new Date(reservation.arrivalDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-[#d4af37]">→</div>
              <div className="text-right">
                <p className="font-lato text-xs uppercase tracking-[2px] text-[#8b8680] mb-3">
                  Departure
                </p>
                <p className="font-playfair text-2xl text-[#2c2416]">
                  {new Date(reservation.departureDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Items */}
        <div className="mb-12 space-y-6">
          {sortedDates.length === 0 ? (
            <div className="rounded-lg bg-white border border-[#e8e4df] p-12 text-center shadow-sm">
              <p className="font-lora text-[#8b8680]">No itinerary items have been added yet.</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div
                key={date}
                className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm"
              >
                <div className="border-b border-[#e8e4df] bg-[#f5f3f0] px-8 py-5">
                  <h3 className="font-playfair text-2xl text-[#2c2416]">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>
                <div className="divide-y divide-[#f0ede8] p-6">
                  {itemsByDate[date].map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#f5f3f0] border border-[#d4af37] text-2xl">
                          {CATEGORY_ICONS[item.category] || "✨"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-playfair text-xl text-[#2c2416]">
                                {item.title}
                              </h4>
                              <p className="mt-1 font-lato text-xs uppercase tracking-wide text-[#8b8680]">
                                {new Date(item.scheduledAt).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-playfair text-xl text-[#d4af37]">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="font-lato text-xs uppercase tracking-wide text-[#8b8680] mt-1">
                                {item.category}
                              </p>
                            </div>
                          </div>
                          {item.description && (
                            <p className="mt-4 font-lora text-[#8b8680]">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total Cost */}
        <div className="mb-12 overflow-hidden rounded-lg bg-gradient-to-r from-[#2c2416] to-[#3e3935] shadow-lg">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-lato text-xs uppercase tracking-[2px] text-[#d4af37] mb-3">
                  Total Investment
                </p>
                <p className="font-playfair text-5xl text-white leading-none">
                  ${totalCost.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-lato text-xs uppercase tracking-wide text-[#d4af37]">{proposal.items.length} experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {status === "SENT" && (
          <div className="space-y-4">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="w-full px-8 py-4 bg-black text-white font-lato font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Approve This Itinerary"}
            </button>
            <p className="text-center font-lora text-sm text-[#666666]">
              Review your curated experiences above before approving
            </p>
          </div>
        )}

        {status === "APPROVED" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-[#d4af37]/10 border border-[#d4af37] px-6 py-4 mb-4">
              <p className="text-[#a3860f] font-lora font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Itinerary Approved
              </p>
            </div>
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full px-8 py-4 bg-black text-white font-lato font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay & Lock In Your Experience"}
            </button>
            <p className="text-center font-lora text-sm text-[#666666]">
              Secure your exclusive experiences with immediate confirmation
            </p>
          </div>
        )}

        {status === "PAID" && (
          <div className="rounded-lg bg-[#d4af37]/10 border border-[#d4af37] px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] mb-4">
              <svg
                className="w-6 h-6 text-[#d4af37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-playfair text-2xl text-[#2c2416] mb-2">
              Your Itinerary is Confirmed
            </p>
            <p className="font-lora text-[#8b8680]">
              All experiences have been locked in for your trip.
            </p>
          </div>
        )}

        {status === "DRAFT" && (
          <div className="rounded-lg bg-[#f5f3f0] border border-[#e8e4df] px-6 py-4">
            <p className="font-lora text-[#8b8680] text-center">
              This proposal is still being prepared by your concierge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
