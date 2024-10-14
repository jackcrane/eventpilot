/*
  Warnings:

  - Made the column `override__eventPrice` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__maxParticipants` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__eventWideCRM` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__eventTeammates` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__readOnlyTeammates` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__fundraising` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__emailMarketing` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__smsMarketing` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__volunteerLimit` on table `EventBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__emailMarketing` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__fundraising` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__orgTeammates` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__orgWideCRM` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__participantPortal` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__participantSelfServicePortal` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__readOnlyTeammates` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `override__smsMarketing` on table `OrganizationBillingConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `EventBillingConfig` MODIFY `override__eventPrice` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `override__maxParticipants` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__eventWideCRM` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__eventTeammates` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__readOnlyTeammates` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__fundraising` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__emailMarketing` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__smsMarketing` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__volunteerLimit` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `OrganizationBillingConfig` MODIFY `override__emailMarketing` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__fundraising` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__orgTeammates` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__orgWideCRM` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__participantPortal` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__participantSelfServicePortal` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `override__readOnlyTeammates` INTEGER NOT NULL DEFAULT 0,
    MODIFY `override__smsMarketing` BOOLEAN NOT NULL DEFAULT false;
