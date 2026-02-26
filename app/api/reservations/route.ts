import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const reservation = await prisma.reservation.findFirst({
      include: {
        member: true,
        proposals: true,
      },
    });

    if (!reservation) {
      return Response.json({ error: "No reservation found" }, { status: 404 });
    }

    return Response.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
