-- DropForeignKey
ALTER TABLE `TodoItem` DROP FOREIGN KEY `TodoItem_type_fkey`;

-- AlterTable
ALTER TABLE `TodoItem` MODIFY `type` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TodoItem` ADD CONSTRAINT `TodoItem_type_fkey` FOREIGN KEY (`type`) REFERENCES `TodoItemType`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
