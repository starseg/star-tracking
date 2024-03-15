-- DropForeignKey
ALTER TABLE `fleetcontact` DROP FOREIGN KEY `FleetContact_fleetId_fkey`;

-- DropForeignKey
ALTER TABLE `fleetemail` DROP FOREIGN KEY `FleetEmail_fleetId_fkey`;

-- AddForeignKey
ALTER TABLE `FleetContact` ADD CONSTRAINT `FleetContact_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FleetEmail` ADD CONSTRAINT `FleetEmail_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE CASCADE ON UPDATE CASCADE;
