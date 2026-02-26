import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/reservations/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: {
        member: true,
        proposals: true,
      },
    });

    if (!reservation) {
      return Response.json({ error: "Reservation not found" }, { status: 404 });
    }

    return Response.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
