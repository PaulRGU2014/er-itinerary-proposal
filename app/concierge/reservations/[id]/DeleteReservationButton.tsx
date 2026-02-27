"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReservationButton({ reservationId }: { reservationId: number }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/reservations/${reservationId}/delete`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Redirect to dashboard after successful deletion
        router.push("/concierge");
      } else {
        setError("Failed to delete reservation");
      }
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-red-600 text-white font-lato text-sm uppercase tracking-wide transition-all duration-300 hover:bg-red-700"
      >
        Delete Reservation
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-[#e8e4df]">
            <h2 className="font-playfair text-2xl text-[#2c2416] mb-4">
              Delete Reservation?
            </h2>
            
            <p className="font-lora text-[#666666] mb-2">
              This action cannot be undone. All associated proposals and data will be permanently deleted.
            </p>
            
            <p className="font-lora text-[#8b8680] text-sm mb-6">
              To confirm deletion, type <span className="font-semibold text-red-600">DELETE</span> below:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Type DELETE"
              className="w-full border border-[#e8e4df] px-4 py-2 mb-4 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />

            {error && (
              <p className="text-red-600 text-sm mb-4 font-lato">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmText("");
                  setError("");
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-[#e8e4df] text-[#2c2416] font-lato text-sm uppercase tracking-wide transition-all duration-300 hover:bg-[#f8f8f8] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmText !== "DELETE"}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-lato text-sm uppercase tracking-wide transition-all duration-300 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
