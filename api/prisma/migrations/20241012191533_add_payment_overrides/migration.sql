-- AlterTable
ALTER TABLE `OrganizationBillingConfig` ADD COLUMN `override__emailMarketing` INTEGER NULL,
    ADD COLUMN `override__fundraising` BOOLEAN NULL,
    ADD COLUMN `override__orgTeammates` INTEGER NULL,
    ADD COLUMN `override__orgWideCRM` BOOLEAN NULL,
    ADD COLUMN `override__participantPortal` BOOLEAN NULL,
    ADD COLUMN `override__participantSelfServicePortal` BOOLEAN NULL,
    ADD COLUMN `override__readOnlyTeammates` INTEGER NULL,
    ADD COLUMN `override__smsMarketing` BOOLEAN NULL,
    ADD COLUMN `tier` ENUM('ESSENTIALS', 'STANDARD', 'PREMIUM', 'ULTIMATE') NOT NULL DEFAULT 'ESSENTIALS';

-- CreateTable
CREATE TABLE `EventBillingConfig` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `override__eventPrice` DOUBLE NULL,
    `override__maxParticipants` INTEGER NULL,
    `override__eventWideCRM` INTEGER NULL,
    `override__eventTeammates` INTEGER NULL,
    `override__readOnlyTeammates` INTEGER NULL,
    `override__fundraising` BOOLEAN NULL,
    `override__emailMarketing` INTEGER NULL,
    `override__smsMarketing` BOOLEAN NULL,
    `override__volunteerLimit` INTEGER NULL,

    UNIQUE INDEX `EventBillingConfig_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventBillingConfig` ADD CONSTRAINT `EventBillingConfig_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
