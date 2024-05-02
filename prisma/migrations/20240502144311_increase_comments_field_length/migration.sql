-- AlterTable
ALTER TABLE `comunicationdescription` MODIFY `description` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `driver` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `driveributton` MODIFY `comments` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `ibutton` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `tracker` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `vehicle` MODIFY `comments` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `vehicletracker` MODIFY `comments` VARCHAR(2000) NOT NULL;
