"use client";

import { useState } from "react";

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
              <svg
                className="w-10 h-10 text-emerald-600"
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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Your Itinerary is Confirmed!
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              We&apos;ve received your payment and locked in your exclusive experiences.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Confirmation Details
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {reservation.destination}
            </h2>
            <div className="space-y-2 text-left">
              <p className="text-slate-700">
                <span className="font-semibold">Guest:</span> {reservation.member.name}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Villa:</span> {reservation.villa}
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
              <p className="text-slate-700">
                <span className="font-semibold">Total Investment:</span> ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>

          <p className="text-slate-600">
            A detailed confirmation has been sent to{" "}
            <span className="font-semibold">{reservation.member.email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800">
            Exclusive Resorts
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Your Curated Itinerary
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            A personalized experience crafted just for you
          </p>
        </div>

        {/* Reservation Details Card */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">
              {reservation.destination}
            </h2>
            <p className="mt-2 text-blue-100">{reservation.villa}</p>
          </div>
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Arrival
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {new Date(reservation.arrivalDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-slate-400">→</div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Departure
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
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
        <div className="mb-8 space-y-6">
          {sortedDates.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-xl">
              <p className="text-slate-600">No itinerary items have been added yet.</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div
                key={date}
                className="overflow-hidden rounded-3xl bg-white shadow-xl"
              >
                <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 p-6">
                  {itemsByDate[date].map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                          {CATEGORY_ICONS[item.category] || "✨"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-sm font-medium text-slate-500">
                                {new Date(item.scheduledAt).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-xs font-medium text-slate-500">
                                {item.category}
                              </p>
                            </div>
                          </div>
                          {item.description && (
                            <p className="mt-3 text-slate-600">{item.description}</p>
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
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl">
          <div className="px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Total Investment
                </p>
                <p className="mt-2 text-4xl font-bold text-white">
                  ${totalCost.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">{proposal.items.length} experiences</p>
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
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Processing..." : "Approve This Itinerary"}
            </button>
            <p className="text-center text-sm text-slate-600">
              Review your curated experiences above before approving
            </p>
          </div>
        )}

        {status === "APPROVED" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-green-50 border border-green-200 px-6 py-4 mb-4">
              <p className="text-green-800 font-semibold flex items-center gap-2">
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
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay & Lock In Your Experience"}
            </button>
            <p className="text-center text-sm text-slate-600">
              Secure your exclusive experiences with immediate confirmation
            </p>
          </div>
        )}

        {status === "PAID" && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
              <svg
                className="w-6 h-6 text-emerald-600"
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
            <p className="text-xl font-bold text-emerald-900 mb-2">
              Your Itinerary is Confirmed!
            </p>
            <p className="text-emerald-700">
              All experiences have been locked in for your trip.
            </p>
          </div>
        )}

        {status === "DRAFT" && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-6 py-4">
            <p className="text-amber-800 font-medium text-center">
              This proposal is still being prepared by your concierge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
