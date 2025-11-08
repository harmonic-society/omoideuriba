/**
 * Orderテーブルのスキーマを更新するマイグレーションスクリプト
 * Renderのシェルから実行可能
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Order Schema Migration ===\n')

  try {
    // Step 1: 新しいカラムを追加（NULL許可で）
    console.log('Step 1: 新しいカラムを追加中...')

    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`orders\`
        ADD COLUMN IF NOT EXISTS \`totalAmount\` DECIMAL(10, 2),
        ADD COLUMN IF NOT EXISTS \`shippingFee\` DECIMAL(10, 2),
        ADD COLUMN IF NOT EXISTS \`shippingName\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingPostalCode\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingPrefecture\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingCity\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingAddressLine1\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingAddressLine2\` VARCHAR(191),
        ADD COLUMN IF NOT EXISTS \`shippingPhoneNumber\` VARCHAR(191)
    `)

    console.log('✅ 新しいカラムを追加しました\n')

    // Step 2: 既存データを移行
    console.log('Step 2: 既存データを移行中...')

    // totalからtotalAmountへコピー
    await prisma.$executeRawUnsafe(`
      UPDATE \`orders\`
      SET \`totalAmount\` = \`total\`
      WHERE \`totalAmount\` IS NULL AND \`total\` IS NOT NULL
    `)

    // デフォルトの送料を設定
    await prisma.$executeRawUnsafe(`
      UPDATE \`orders\`
      SET \`shippingFee\` = 500
      WHERE \`shippingFee\` IS NULL AND \`totalAmount\` IS NOT NULL
    `)

    console.log('✅ 既存データを移行しました\n')

    // Step 3: NOT NULL制約を追加
    console.log('Step 3: NOT NULL制約を追加中...')

    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`orders\`
        MODIFY \`totalAmount\` DECIMAL(10, 2) NOT NULL,
        MODIFY \`shippingFee\` DECIMAL(10, 2) NOT NULL,
        MODIFY \`shippingName\` VARCHAR(191) NOT NULL,
        MODIFY \`shippingPostalCode\` VARCHAR(191) NOT NULL,
        MODIFY \`shippingPrefecture\` VARCHAR(191) NOT NULL,
        MODIFY \`shippingCity\` VARCHAR(191) NOT NULL,
        MODIFY \`shippingAddressLine1\` VARCHAR(191) NOT NULL,
        MODIFY \`shippingPhoneNumber\` VARCHAR(191) NOT NULL
    `)

    console.log('✅ NOT NULL制約を追加しました\n')

    // Step 4: 古いカラムを削除（オプション - コメントアウト）
    console.log('Step 4: 古いカラムの削除はスキップします')
    console.log('注意: `total`と`shippingAddress`カラムは残されています')
    console.log('データ移行が確認できたら、手動で削除してください\n')

    // 確認用: 更新後のスキーマを表示
    console.log('=== マイグレーション完了 ===\n')
    console.log('確認: 注文数を確認中...')

    const orderCount = await prisma.order.count()
    console.log(`✅ 注文数: ${orderCount}件\n`)

    if (orderCount > 0) {
      console.log('最新の注文を確認中...')
      const latestOrder = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          totalAmount: true,
          shippingFee: true,
          shippingName: true,
          status: true,
          createdAt: true,
        }
      })
      console.log('最新の注文:', latestOrder)
    }

    console.log('\n✅ すべて完了しました！')
    console.log('サイトを再起動して動作を確認してください。')

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error)

    if (error instanceof Error) {
      if (error.message.includes('Duplicate column')) {
        console.log('\n⚠️  カラムが既に存在します。')
        console.log('マイグレーションは既に実行されている可能性があります。')
      } else if (error.message.includes('cannot be null')) {
        console.log('\n⚠️  NULL値が存在します。')
        console.log('Step 2のデータ移行を確認してください。')
      }
    }

    throw error
  }
}

main()
  .then(() => {
    console.log('\n=== スクリプト終了 ===')
    process.exit(0)
  })
  .catch((error) => {
    console.error('致命的エラー:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
