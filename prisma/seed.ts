import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const member1 = await prisma.member.create({
    data: {
      name: "James Whitfield",
      email: "james.whitfield@example.com",
    },
  });

  const reservation1 = await prisma.reservation.create({
    data: {
      memberId: member1.id,
      destination: "Punta Mita",
      villa: "Villa Pacifica",
      arrivalDate: new Date("2025-03-15"),
      departureDate: new Date("2025-03-22"),
    },
  });

  // Create a sample proposal for the first reservation
  const proposal1 = await prisma.proposal.create({
    data: {
      reservationId: reservation1.id,
      status: "SENT",
      sentAt: new Date("2025-02-20"),
      items: {
        create: [
          {
            category: "Dining",
            title: "Private Chef Dinner",
            description: "Five-course tasting menu with wine pairings on the private terrace",
            scheduledAt: new Date("2025-03-16T19:00:00"),
            price: 1500,
          },
          {
            category: "Activities",
            title: "Sunrise Surf Lesson",
            description: "Professional instruction with board and wetsuit included",
            scheduledAt: new Date("2025-03-17T06:00:00"),
            price: 350,
          },
          {
            category: "Wellness",
            title: "Couples Spa Treatment",
            description: "90-minute massage and facial at beachfront spa",
            scheduledAt: new Date("2025-03-18T10:00:00"),
            price: 800,
          },
          {
            category: "Excursions",
            title: "Boat Charter & Snorkeling",
            description: "Half-day private yacht charter with snorkeling at pristine reefs",
            scheduledAt: new Date("2025-03-19T08:00:00"),
            price: 2200,
          },
        ],
      },
      guests: {
        create: [
          {
            name: "Sarah Whitfield",
            email: "sarah.whitfield@example.com",
          },
        ],
      },
    },
  });

  const member2 = await prisma.member.create({
    data: {
      name: "Alexandra Sterling",
      email: "alexandra.sterling@example.com",
    },
  });

  await prisma.reservation.create({
    data: {
      memberId: member2.id,
      destination: "Cabo San Lucas",
      villa: "Casa del Cielo",
      arrivalDate: new Date("2025-04-10"),
      departureDate: new Date("2025-04-18"),
    },
  });

  const member3 = await prisma.member.create({
    data: {
      name: "Marcus & Diana Chen",
      email: "chen.family@example.com",
    },
  });

  await prisma.reservation.create({
    data: {
      memberId: member3.id,
      destination: "Turks and Caicos",
      villa: "Oceanview Estate",
      arrivalDate: new Date("2025-05-01"),
      departureDate: new Date("2025-05-09"),
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
