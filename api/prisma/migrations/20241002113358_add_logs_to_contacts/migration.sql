-- AlterTable
ALTER TABLE `Log` ADD COLUMN `organizationMarketingContactId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_organizationMarketingContactId_fkey` FOREIGN KEY (`organizationMarketingContactId`) REFERENCES `OrganizationMarketingContact`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
