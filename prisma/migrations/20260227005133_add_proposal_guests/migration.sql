/*
  Warnings:

  - Added the required column `body` to the `SentEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `SentEmail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ProposalGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proposalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProposalGuest_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SentEmail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proposalId" INTEGER NOT NULL,
    "sentAt" DATETIME NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "bodyPreview" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    CONSTRAINT "SentEmail_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SentEmail" ("bodyPreview", "id", "proposalId", "sentAt", "toEmail") SELECT "bodyPreview", "id", "proposalId", "sentAt", "toEmail" FROM "SentEmail";
DROP TABLE "SentEmail";
ALTER TABLE "new_SentEmail" RENAME TO "SentEmail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
