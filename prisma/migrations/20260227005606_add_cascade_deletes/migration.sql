-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proposal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" DATETIME,
    CONSTRAINT "Proposal_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Proposal" ("createdAt", "id", "reservationId", "sentAt", "status") SELECT "createdAt", "id", "reservationId", "sentAt", "status" FROM "Proposal";
DROP TABLE "Proposal";
ALTER TABLE "new_Proposal" RENAME TO "Proposal";
CREATE TABLE "new_ProposalItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proposalId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "ProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProposalItem" ("category", "description", "id", "price", "proposalId", "scheduledAt", "title") SELECT "category", "description", "id", "price", "proposalId", "scheduledAt", "title" FROM "ProposalItem";
DROP TABLE "ProposalItem";
ALTER TABLE "new_ProposalItem" RENAME TO "ProposalItem";
CREATE TABLE "new_SentEmail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proposalId" INTEGER NOT NULL,
    "sentAt" DATETIME NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "bodyPreview" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    CONSTRAINT "SentEmail_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SentEmail" ("body", "bodyPreview", "id", "proposalId", "sentAt", "subject", "toEmail") SELECT "body", "bodyPreview", "id", "proposalId", "sentAt", "subject", "toEmail" FROM "SentEmail";
DROP TABLE "SentEmail";
ALTER TABLE "new_SentEmail" RENAME TO "SentEmail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
