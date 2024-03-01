/*
  Warnings:

  - You are about to drop the column `ibuttonStatusId` on the `ibutton` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tracker` table. All the data in the column will be lost.
  - You are about to drop the `ibuttonstatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ibutton` DROP FOREIGN KEY `IButton_ibuttonStatusId_fkey`;

-- AlterTable
ALTER TABLE `ibutton` DROP COLUMN `ibuttonStatusId`,
    ADD COLUMN `deviceStatusId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `tracker` DROP COLUMN `status`,
    ADD COLUMN `deviceStatusId` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `ibuttonstatus`;

-- CreateTable
CREATE TABLE `DeviceStatus` (
    `deviceStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`deviceStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IButton` ADD CONSTRAINT `IButton_deviceStatusId_fkey` FOREIGN KEY (`deviceStatusId`) REFERENCES `DeviceStatus`(`deviceStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tracker` ADD CONSTRAINT `Tracker_deviceStatusId_fkey` FOREIGN KEY (`deviceStatusId`) REFERENCES `DeviceStatus`(`deviceStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;
