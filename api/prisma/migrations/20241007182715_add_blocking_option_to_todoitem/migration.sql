-- AlterTable
ALTER TABLE `Event` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `endDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `TodoItem` ADD COLUMN `blocking` BOOLEAN NOT NULL DEFAULT false;
