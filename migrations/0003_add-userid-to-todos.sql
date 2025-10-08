-- Migration number: 0003 	 2025-10-08T03:10:00.000Z

-- Add userId column to Todo table (allow NULL initially)
ALTER TABLE "Todo" ADD COLUMN "userId" TEXT;

-- Delete any existing todos since we can't easily assign them to users
-- In a real scenario, you'd handle this more carefully
DELETE FROM "Todo";

-- Recreate the table with proper foreign key constraint
CREATE TABLE "Todo_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Drop old table and rename new table
DROP TABLE "Todo";
ALTER TABLE "Todo_new" RENAME TO "Todo";