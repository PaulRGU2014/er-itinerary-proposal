import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Load proposal with reservation + member
    const proposal = await prisma.proposal.findUnique({
      where: { id: Number(id) },
      include: {
        reservation: {
          include: { member: true },
        },
      },
    });

    if (!proposal) {
      return Response.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Update proposal status + sentAt
    const updated = await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    // Log the email send event
    await prisma.sentEmail.create({
      data: {
        proposalId: updated.id,
        sentAt: new Date(),
        subject: "Your Exclusive Resorts Itinerary Proposal",
        body: "Your proposal is ready for review.",
        bodyPreview: "Your proposal is ready for review.",
        toEmail: proposal.reservation.member.email,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error sending proposal:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
