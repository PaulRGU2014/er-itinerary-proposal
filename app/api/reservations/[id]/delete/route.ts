import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

// DELETE /api/reservations/:id/delete
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // First, delete all proposals associated with this reservation
    // which will cascade delete proposal items and guests
    await prisma.proposal.deleteMany({
      where: { reservationId: Number(id) },
    });

    // Then delete the reservation
    await prisma.reservation.delete({
      where: { id: Number(id) },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
