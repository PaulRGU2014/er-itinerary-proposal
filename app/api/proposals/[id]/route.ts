import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/proposals/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const proposal = await prisma.proposal.findUnique({
      where: { id: Number(id) },
      include: {
        reservation: {
          include: { member: true },
        },
        items: true,
        guests: true,
        sentEmails: true,
      },
    });

    if (!proposal) {
      return Response.json({ error: "Proposal not found" }, { status: 404 });
    }

    return Response.json(proposal);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/proposals/:id
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.proposal.update({
      where: { id: Number(id) },
      data: body,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating proposal:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
