-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_type_fkey`;

-- DropForeignKey
ALTER TABLE `Otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Otp` ADD CONSTRAINT `Otp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_type_fkey` FOREIGN KEY (`type`) REFERENCES `LogType`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
