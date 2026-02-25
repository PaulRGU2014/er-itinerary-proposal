import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const member = await prisma.member.create({
    data: {
      name: "James Whitfield",
      email: "james.whitfield@example.com",
    },
  });

  await prisma.reservation.create({
    data: {
      memberId: member.id,
      destination: "Punta Mita",
      villa: "Villa Pacifica",
      arrivalDate: new Date("2025-03-15"),
      departureDate: new Date("2025-03-22"),
    },
  });
}

main()
  .then(() => console.log("Database seeded."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
