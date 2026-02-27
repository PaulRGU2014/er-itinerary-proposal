import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/proposals/:id/guests
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const guests = await prisma.proposalGuest.findMany({
      where: { proposalId: Number(id) },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/proposals/:id/guests
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body.name || !body.email) {
      return Response.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const guest = await prisma.proposalGuest.create({
      data: {
        proposalId: Number(id),
        name: body.name,
        email: body.email,
      },
    });

    return Response.json(guest, { status: 201 });
  } catch (error) {
    console.error("Error creating guest:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
