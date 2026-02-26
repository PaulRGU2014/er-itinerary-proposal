import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const { category, title, description, scheduledAt, price } = body;

    if (!category || !title || !scheduledAt || price == null) {
      return Response.json(
        { error: "category, title, scheduledAt, and price are required" },
        { status: 400 }
      );
    }

    const item = await prisma.proposalItem.create({
      data: {
        proposalId: Number(id),
        category,
        title,
        description: description ?? "",
        scheduledAt: new Date(scheduledAt),
        price,
      },
    });

    return Response.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating proposal item:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
