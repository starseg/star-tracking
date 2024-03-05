/*
  Warnings:

  - Added the required column `comments` to the `DriverIButton` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comments` to the `VehicleTracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `driveributton` ADD COLUMN `comments` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `vehicletracker` ADD COLUMN `comments` VARCHAR(191) NOT NULL;
