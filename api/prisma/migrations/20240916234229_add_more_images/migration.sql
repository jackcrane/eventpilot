/*
  Warnings:

  - You are about to drop the column `marketingSecondaryBannerImageId` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marketingLogoId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marketingSquareLogoId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Organization` DROP FOREIGN KEY `Organization_marketingSecondaryBannerImageId_fkey`;

-- AlterTable
ALTER TABLE `Organization` DROP COLUMN `marketingSecondaryBannerImageId`,
    ADD COLUMN `marketingLogoId` VARCHAR(191) NULL,
    ADD COLUMN `marketingSquareLogoId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organization_marketingLogoId_key` ON `Organization`(`marketingLogoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Organization_marketingSquareLogoId_key` ON `Organization`(`marketingSquareLogoId`);

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_marketingLogoId_fkey` FOREIGN KEY (`marketingLogoId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_marketingSquareLogoId_fkey` FOREIGN KEY (`marketingSquareLogoId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
