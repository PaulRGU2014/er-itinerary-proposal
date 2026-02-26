"use client";

import Link from "next/link";
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

const CATEGORIES = [
  {
    name: "Dining",
    icon: "🍽️",
    examples: "Private chef dinner, restaurant reservation",
  },
  {
    name: "Activities",
    icon: "🏄",
    examples: "Surf lesson, snorkeling, ATV tour",
  },
  {
    name: "Wellness",
    icon: "💆",
    examples: "Spa treatment, yoga session, massage",
  },
  {
    name: "Excursions",
    icon: "⛵",
    examples: "Whale watching, sailing charter, cultural tour",
  },
  {
    name: "Transport",
    icon: "🚗",
    examples: "Airport transfer, private car, helicopter",
  },
  {
    name: "Experiences",
    icon: "🌅",
    examples: "Sunset cocktails, bonfire on the beach, tequila tasting",
  },
];

export default function ProposalEditorClient({ proposal }: { proposal: Proposal }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    price: "",
  });
  const [items, setItems] = useState(proposal.items);
  const [sending, setSending] = useState(false);

  const reservation = proposal.reservation;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    try {
      const res = await fetch(`/api/proposals/${proposal.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          title: formData.title,
          description: formData.description,
          scheduledAt: formData.scheduledAt,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems([...items, newItem]);
        // Reset form
        setFormData({ title: "", description: "", scheduledAt: "", price: "" });
        setSelectedCategory("");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
    }
  };

  const handleSend = async () => {
    if (items.length === 0) {
      alert("Please add at least one item before sending");
      return;
    }

    if (!confirm("Are you sure you want to send this proposal to the member?")) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/send`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Proposal sent successfully!");
        window.location.href = "/concierge";
      }
    } catch (error) {
      console.error("Error sending proposal:", error);
      alert("Failed to send proposal");
    } finally {
      setSending(false);
    }
  };

  const totalCost = items.reduce((sum: number, item: ProposalItem) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/concierge"
              className="mb-2 inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              Proposal #{proposal.id}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Building itinerary for {reservation.member.name}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <Link
              href={`/proposals/${proposal.id}`}
              target="_blank"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              View as Member →
            </Link>
            {proposal.status === "DRAFT" && items.length > 0 && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send to Member"}
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              proposal.status === "DRAFT"
                ? "bg-gray-100 text-gray-800"
                : proposal.status === "SENT"
                ? "bg-blue-100 text-blue-800"
                : proposal.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {proposal.status}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Add Items */}
          <div className="space-y-6">
            {/* Reservation Context */}
            <div className="overflow-hidden rounded-xl bg-white shadow">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Reservation Details
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Guest:</span> {reservation.member.name}
                  </p>
                  <p>
                    <span className="font-semibold">Destination:</span>{" "}
                    {reservation.destination}
                  </p>
                  <p>
                    <span className="font-semibold">Villa:</span> {reservation.villa}
                  </p>
                  <p>
                    <span className="font-semibold">Dates:</span>{" "}
                    {new Date(reservation.arrivalDate).toLocaleDateString()} -{" "}
                    {new Date(reservation.departureDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="overflow-hidden rounded-xl bg-white shadow">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Select Category
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedCategory === cat.name
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="mb-2 text-3xl">{cat.icon}</div>
                      <div className="font-semibold text-slate-900">{cat.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{cat.examples}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="overflow-hidden rounded-xl bg-white shadow">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Item Details
                </h2>
              </div>
              <form onSubmit={handleAddItem} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Private Chef Dinner"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Provide details about this experience..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="scheduledAt"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledAt"
                      value={formData.scheduledAt}
                      onChange={(e) =>
                        setFormData({ ...formData, scheduledAt: e.target.value })
                      }
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCategory}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add to Itinerary
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Current Items */}
          <div>
            <div className="overflow-hidden rounded-xl bg-white shadow">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Itinerary Items
                  </h2>
                  <span className="text-sm text-slate-600">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-slate-600">
                      No items added yet. Select a category and add your first experience.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item: ProposalItem) => {
                      const cat = CATEGORIES.find((c) => c.name === item.category);
                      return (
                        <div
                          key={item.id}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{cat?.icon || "✨"}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-slate-900">
                                    {item.title}
                                  </h3>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {item.category} •{" "}
                                    {new Date(item.scheduledAt).toLocaleString()}
                                  </p>
                                </div>
                                <p className="font-bold text-slate-900">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              {item.description && (
                                <p className="mt-2 text-sm text-slate-600">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="rounded-lg bg-slate-900 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Total Cost</span>
                        <span className="text-2xl font-bold text-white">
                          ${totalCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
