/**
 * SQLマイグレーションを実行するスクリプト
 * Renderのシェルで実行してください
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Order Table Migration ===\n')

  try {
    // Step 1: 新しいカラムを追加
    console.log('Step 1: 新しいカラムを追加中...')

    try {
      await prisma.$executeRaw`
        ALTER TABLE orders
          ADD COLUMN totalAmount DECIMAL(10, 2),
          ADD COLUMN shippingFee DECIMAL(10, 2),
          ADD COLUMN shippingName VARCHAR(191),
          ADD COLUMN shippingPostalCode VARCHAR(191),
          ADD COLUMN shippingPrefecture VARCHAR(191),
          ADD COLUMN shippingCity VARCHAR(191),
          ADD COLUMN shippingAddressLine1 VARCHAR(191),
          ADD COLUMN shippingAddressLine2 VARCHAR(191),
          ADD COLUMN shippingPhoneNumber VARCHAR(191)
      `
      console.log('✅ 新しいカラムを追加しました\n')
    } catch (error: any) {
      if (error.message.includes('Duplicate column')) {
        console.log('⚠️  カラムは既に存在します。スキップします。\n')
      } else {
        throw error
      }
    }

    // Step 2: 既存データを移行
    console.log('Step 2: 既存データを移行中...')

    // totalからtotalAmountへコピー
    const updated1 = await prisma.$executeRaw`
      UPDATE orders
      SET totalAmount = total
      WHERE totalAmount IS NULL AND total IS NOT NULL
    `
    console.log(`  - totalAmountを更新: ${updated1}件`)

    // デフォルトの送料を設定
    const updated2 = await prisma.$executeRaw`
      UPDATE orders
      SET shippingFee = 500
      WHERE shippingFee IS NULL AND totalAmount IS NOT NULL
    `
    console.log(`  - shippingFeeを更新: ${updated2}件`)

    console.log('✅ 既存データを移行しました\n')

    // Step 3: NOT NULL制約を追加
    console.log('Step 3: NOT NULL制約を追加中...')

    await prisma.$executeRaw`
      ALTER TABLE orders
        MODIFY totalAmount DECIMAL(10, 2) NOT NULL,
        MODIFY shippingFee DECIMAL(10, 2) NOT NULL,
        MODIFY shippingName VARCHAR(191) NOT NULL,
        MODIFY shippingPostalCode VARCHAR(191) NOT NULL,
        MODIFY shippingPrefecture VARCHAR(191) NOT NULL,
        MODIFY shippingCity VARCHAR(191) NOT NULL,
        MODIFY shippingAddressLine1 VARCHAR(191) NOT NULL,
        MODIFY shippingPhoneNumber VARCHAR(191) NOT NULL
    `
    console.log('✅ NOT NULL制約を追加しました\n')

    // 確認
    console.log('=== 完了 ===\n')
    const orderCount = await prisma.order.count()
    console.log(`✅ 注文数: ${orderCount}件`)

    if (orderCount > 0) {
      const latest = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          totalAmount: true,
          shippingFee: true,
          status: true,
          createdAt: true
        }
      })
      console.log('\n最新の注文:', latest)
    }

    console.log('\n✅ すべて完了しました！')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)
    throw error
  }
}

main()
  .then(() => {
    console.log('\n=== マイグレーション成功 ===')
    process.exit(0)
  })
  .catch((error) => {
    console.error('マイグレーション失敗:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
