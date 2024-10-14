-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `isInGoodPaymentStanding` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL;
