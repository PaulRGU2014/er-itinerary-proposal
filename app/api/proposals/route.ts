import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// GET /api/proposals → list all proposals
export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        reservation: {
          include: { member: true },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/proposals → create a new proposal
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { reservationId } = body;

    if (!reservationId) {
      return Response.json(
        { error: "reservationId is required" },
        { status: 400 },
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        reservationId,
      },
    });

    return Response.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
