-- CreateTable
CREATE TABLE `FleetLogin` (
    `fleetLoginId` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accessTo` VARCHAR(191) NOT NULL,
    `fleetId` INTEGER NOT NULL,

    PRIMARY KEY (`fleetLoginId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FleetLogin` ADD CONSTRAINT `FleetLogin_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE CASCADE ON UPDATE CASCADE;
