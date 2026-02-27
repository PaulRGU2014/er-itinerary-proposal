import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

// DELETE /api/proposals/:id/guests/:guestId
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    const { id, guestId } = await context.params;

    // Verify the guest belongs to this proposal
    const guest = await prisma.proposalGuest.findUnique({
      where: { id: Number(guestId) },
    });

    if (!guest || guest.proposalId !== Number(id)) {
      return Response.json({ error: "Guest not found" }, { status: 404 });
    }

    await prisma.proposalGuest.delete({
      where: { id: Number(guestId) },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting guest:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
