-- AlterTable
ALTER TABLE `ComunicationDescription` MODIFY `description` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `Driver` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `DriverIButton` MODIFY `comments` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `IButton` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `Tracker` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `Vehicle` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `VehicleTracker` MODIFY `comments` VARCHAR(2000) NOT NULL;
