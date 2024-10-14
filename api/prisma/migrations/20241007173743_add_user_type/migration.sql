/*
  Warnings:

  - Added the required column `type` to the `UserEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserEvent` ADD COLUMN `type` ENUM('OWNER', 'ADMIN', 'USER', 'INVITEE', 'SUSPENDED') NOT NULL;
