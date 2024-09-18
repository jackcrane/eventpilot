-- AlterTable
ALTER TABLE `Log` ADD COLUMN `eventId` VARCHAR(191) NULL,
    ADD COLUMN `organizationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
