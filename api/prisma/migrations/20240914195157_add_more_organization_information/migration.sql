-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `privateContactEmail` VARCHAR(191) NULL,
    ADD COLUMN `privateContactPhone` VARCHAR(191) NULL,
    ADD COLUMN `publicContactEmail` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;
