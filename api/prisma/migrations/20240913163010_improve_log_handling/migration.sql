/*
  Warnings:

  - Added the required column `data` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Log` ADD COLUMN `data` JSON NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `LogType` (
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_type_fkey` FOREIGN KEY (`type`) REFERENCES `LogType`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
