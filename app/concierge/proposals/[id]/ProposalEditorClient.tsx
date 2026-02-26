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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <Link
              href="/concierge"
              className="mb-4 inline-flex items-center gap-2 px-6 py-3 text-[#666666] font-lato text-sm uppercase tracking-wide border border-[#f0f0f0] transition-all duration-300 hover:text-black hover:border-black hover:bg-[#f8f8f8]"
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
            <h1 className="font-playfair text-4xl text-[#2c2416] mb-2">
              Proposal #{proposal.id}
            </h1>
            <p className="font-lora text-[#8b8680]">
              Building itinerary for {reservation.member.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-2 border border-black text-black font-lato text-xs uppercase tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <Link
              href={`/proposals/${proposal.id}`}
              target="_blank"
              className="px-6 py-2 border border-black text-black font-lato text-xs uppercase tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
            >
              View as Member
            </Link>
            {proposal.status === "DRAFT" && items.length > 0 && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2 bg-black text-white font-lato text-xs uppercase tracking-wide transition-all duration-300 hover:shadow-2xl disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send to Member"}
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <span
            className={`inline-flex px-3 py-1 text-xs font-lato uppercase tracking-wide ${
              proposal.status === "DRAFT"
                ? "bg-[#f8f8f8] text-[#666666]"
                : proposal.status === "SENT"
                ? "bg-[#f5f3f0] text-[#2c2416]"
                : proposal.status === "APPROVED"
                ? "bg-[#d4af37]/10 text-[#a3860f]"
                : "bg-black text-white"
            }`}
          >
            {proposal.status}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Add Items */}
          <div className="space-y-6">
            {/* Reservation Context */}
            <div className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
              <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-6 py-4">
                <h2 className="font-playfair text-xl text-[#2c2416]">
                  Reservation Details
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm text-[#2c2416]">
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
            <div className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
              <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-6 py-4">
                <h2 className="font-playfair text-xl text-[#2c2416]">
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
                      className={`border-2 p-4 text-left transition-all ${
                        selectedCategory === cat.name
                          ? "border-black bg-[#f8f8f8]"
                          : "border-[#e8e4df] bg-white hover:border-black"
                      }`}
                    >
                      <div className="mb-2 text-3xl">{cat.icon}</div>
                      <div className="font-lora text-[#2c2416]">{cat.name}</div>
                      <div className="mt-1 text-xs text-[#8b8680]">{cat.examples}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
              <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-6 py-4">
                <h2 className="font-playfair text-xl text-[#2c2416]">
                  Add Item Details
                </h2>
              </div>
              <form onSubmit={handleAddItem} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-lato uppercase tracking-wide text-[#666666]"
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
                      className="mt-2 block w-full border border-[#e8e4df] px-3 py-2 text-[#2c2416] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="e.g., Private Chef Dinner"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-lato uppercase tracking-wide text-[#666666]"
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
                      className="mt-2 block w-full border border-[#e8e4df] px-3 py-2 text-[#2c2416] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Provide details about this experience..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="scheduledAt"
                      className="block text-sm font-lato uppercase tracking-wide text-[#666666]"
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
                      className="mt-2 block w-full border border-[#e8e4df] px-3 py-2 text-[#2c2416] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-lato uppercase tracking-wide text-[#666666]"
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
                      className="mt-2 block w-full border border-[#e8e4df] px-3 py-2 text-[#2c2416] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="0.00"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCategory}
                    className="w-full bg-black px-4 py-3 text-sm font-lato font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add to Itinerary
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Current Items */}
          <div>
            <div className="overflow-hidden rounded-lg bg-white border border-[#e8e4df] shadow-sm">
              <div className="border-b border-[#e8e4df] bg-gradient-to-r from-[#f5f3f0] to-[#f0ede8] px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-playfair text-xl text-[#2c2416]">
                    Itinerary Items
                  </h2>
                  <span className="text-sm text-[#8b8680]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-lora text-[#8b8680]">
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
                          className="border border-[#e8e4df] p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{cat?.icon || "✨"}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-playfair text-lg text-[#2c2416]">
                                    {item.title}
                                  </h3>
                                  <p className="mt-1 text-xs text-[#8b8680]">
                                    {item.category} •{" "}
                                    {new Date(item.scheduledAt).toLocaleString()}
                                  </p>
                                </div>
                                <p className="font-playfair text-lg text-[#d4af37]">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              {item.description && (
                                <p className="mt-2 text-sm text-[#8b8680]">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="bg-black p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-lato text-xs uppercase tracking-wide text-[#d4af37]">Total Cost</span>
                        <span className="text-2xl font-playfair text-white">
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
