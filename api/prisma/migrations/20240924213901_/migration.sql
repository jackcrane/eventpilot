/*
  Warnings:

  - You are about to drop the column `done` on the `TodoItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TodoItem` DROP COLUMN `done`,
    ADD COLUMN `stage` ENUM('OPEN', 'IN_PROGRESS', 'WAITING', 'BLOCKED', 'COMPLETE', 'WONT_DO') NOT NULL DEFAULT 'OPEN';
