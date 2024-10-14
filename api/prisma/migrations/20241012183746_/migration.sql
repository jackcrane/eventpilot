/*
  Warnings:

  - You are about to drop the column `isInGoodPaymentStanding` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Organization` DROP COLUMN `isInGoodPaymentStanding`,
    DROP COLUMN `stripeCustomerId`;

-- CreateTable
CREATE TABLE `OrganizationBillingConfig` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `isInGoodPaymentStanding` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `OrganizationBillingConfig_organizationId_key`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrganizationBillingConfig` ADD CONSTRAINT `OrganizationBillingConfig_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
