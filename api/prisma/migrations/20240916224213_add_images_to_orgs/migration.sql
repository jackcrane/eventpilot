/*
  Warnings:

  - You are about to drop the column `marketingLogoImage` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `marketingPrimaryBannerImage` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marketingPrimaryBannerImageId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marketingSecondaryBannerImageId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Organization` DROP COLUMN `marketingLogoImage`,
    DROP COLUMN `marketingPrimaryBannerImage`,
    ADD COLUMN `marketingPrimaryBannerImageId` VARCHAR(191) NULL,
    ADD COLUMN `marketingSecondaryBannerImageId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Organization_marketingPrimaryBannerImageId_key` ON `Organization`(`marketingPrimaryBannerImageId`);

-- CreateIndex
CREATE UNIQUE INDEX `Organization_marketingSecondaryBannerImageId_key` ON `Organization`(`marketingSecondaryBannerImageId`);

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_marketingPrimaryBannerImageId_fkey` FOREIGN KEY (`marketingPrimaryBannerImageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organization` ADD CONSTRAINT `Organization_marketingSecondaryBannerImageId_fkey` FOREIGN KEY (`marketingSecondaryBannerImageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
