/*
  Warnings:

  - A unique constraint covering the columns `[userEventId]` on the table `EventInvitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `EventInvitation` ADD COLUMN `userEventId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Log` ADD COLUMN `eventInvitationId` VARCHAR(191) NULL,
    ADD COLUMN `userEventId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `UserEvent` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `EventInvitation_userEventId_key` ON `EventInvitation`(`userEventId`);

-- AddForeignKey
ALTER TABLE `EventInvitation` ADD CONSTRAINT `EventInvitation_userEventId_fkey` FOREIGN KEY (`userEventId`) REFERENCES `UserEvent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEvent` ADD CONSTRAINT `UserEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEvent` ADD CONSTRAINT `UserEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_userEventId_fkey` FOREIGN KEY (`userEventId`) REFERENCES `UserEvent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_eventInvitationId_fkey` FOREIGN KEY (`eventInvitationId`) REFERENCES `EventInvitation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
