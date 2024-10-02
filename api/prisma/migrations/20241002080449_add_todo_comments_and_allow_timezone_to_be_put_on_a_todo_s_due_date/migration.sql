-- AlterTable
ALTER TABLE `Log` ADD COLUMN `todoItemCommentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `TodoItem` ADD COLUMN `dueDateTimezone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TodoItemComment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `text` TEXT NOT NULL,
    `todoItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_todoItemCommentId_fkey` FOREIGN KEY (`todoItemCommentId`) REFERENCES `TodoItemComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TodoItemComment` ADD CONSTRAINT `TodoItemComment_todoItemId_fkey` FOREIGN KEY (`todoItemId`) REFERENCES `TodoItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TodoItemComment` ADD CONSTRAINT `TodoItemComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
