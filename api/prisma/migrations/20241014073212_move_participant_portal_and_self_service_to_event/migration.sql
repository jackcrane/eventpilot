/*
  Warnings:

  - You are about to drop the column `override__participantPortal` on the `OrganizationBillingConfig` table. All the data in the column will be lost.
  - You are about to drop the column `override__participantSelfServicePortal` on the `OrganizationBillingConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EventBillingConfig` ADD COLUMN `override__participantPortal` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `override__participantSelfServicePortal` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `OrganizationBillingConfig` DROP COLUMN `override__participantPortal`,
    DROP COLUMN `override__participantSelfServicePortal`;
