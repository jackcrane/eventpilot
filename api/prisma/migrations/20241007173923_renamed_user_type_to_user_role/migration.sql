/*
  Warnings:

  - You are about to drop the column `type` on the `UserEvent` table. All the data in the column will be lost.
  - Added the required column `role` to the `UserEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserEvent` DROP COLUMN `type`,
    ADD COLUMN `role` ENUM('OWNER', 'ADMIN', 'USER', 'INVITEE', 'SUSPENDED') NOT NULL;
