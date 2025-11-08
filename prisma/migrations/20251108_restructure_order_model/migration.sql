-- RestructureOrderModel Migration
-- This migration updates the orders table to use individual fields instead of JSON

-- Step 1: Add new columns (nullable first to avoid errors with existing data)
ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `totalAmount` DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS `shippingFee` DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS `shippingName` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingPostalCode` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingPrefecture` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingCity` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingAddressLine1` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingAddressLine2` VARCHAR(191),
  ADD COLUMN IF NOT EXISTS `shippingPhoneNumber` VARCHAR(191);

-- Step 2: Migrate existing data (if any orders exist)
-- Copy total to totalAmount
UPDATE `orders`
SET `totalAmount` = `total`
WHERE `totalAmount` IS NULL AND `total` IS NOT NULL;

-- Set default shipping fee for existing orders
UPDATE `orders`
SET `shippingFee` = 500
WHERE `shippingFee` IS NULL AND `totalAmount` IS NOT NULL;

-- Note: shippingAddress JSON data cannot be easily migrated automatically
-- If there are existing orders, manual data migration may be required

-- Step 3: Make new columns NOT NULL (after data migration)
ALTER TABLE `orders`
  MODIFY `totalAmount` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingFee` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingName` VARCHAR(191) NOT NULL,
  MODIFY `shippingPostalCode` VARCHAR(191) NOT NULL,
  MODIFY `shippingPrefecture` VARCHAR(191) NOT NULL,
  MODIFY `shippingCity` VARCHAR(191) NOT NULL,
  MODIFY `shippingAddressLine1` VARCHAR(191) NOT NULL,
  MODIFY `shippingPhoneNumber` VARCHAR(191) NOT NULL;

-- Step 4: Drop old columns (commented out for safety)
-- Only uncomment after verifying data migration is complete
-- ALTER TABLE `orders` DROP COLUMN `total`;
-- ALTER TABLE `orders` DROP COLUMN `shippingAddress`;
