-- Order テーブルのスキーマ更新SQL
-- Renderのシェルで実行してください

-- Step 1: 新しいカラムを追加（NULL許可）
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

-- Step 2: 既存データを移行
UPDATE `orders`
SET `totalAmount` = `total`
WHERE `totalAmount` IS NULL AND `total` IS NOT NULL;

UPDATE `orders`
SET `shippingFee` = 500
WHERE `shippingFee` IS NULL AND `totalAmount` IS NOT NULL;

-- Step 3: NOT NULL制約を追加
ALTER TABLE `orders`
  MODIFY `totalAmount` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingFee` DECIMAL(10, 2) NOT NULL,
  MODIFY `shippingName` VARCHAR(191) NOT NULL,
  MODIFY `shippingPostalCode` VARCHAR(191) NOT NULL,
  MODIFY `shippingPrefecture` VARCHAR(191) NOT NULL,
  MODIFY `shippingCity` VARCHAR(191) NOT NULL,
  MODIFY `shippingAddressLine1` VARCHAR(191) NOT NULL,
  MODIFY `shippingPhoneNumber` VARCHAR(191) NOT NULL;
