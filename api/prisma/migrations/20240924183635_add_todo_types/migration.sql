/*
  Warnings:

  - Added the required column `type` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TodoItem` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `TodoItemType` (
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TodoItem` ADD CONSTRAINT `TodoItem_type_fkey` FOREIGN KEY (`type`) REFERENCES `TodoItemType`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
