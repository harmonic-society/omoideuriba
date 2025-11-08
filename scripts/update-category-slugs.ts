/**
 * カテゴリのslugを更新するスクリプト
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categoryUpdates = [
  { name: 'おもちゃ', slug: 'toy' },
  { name: 'ゲーム', slug: 'game' },
  { name: 'CD・レコード', slug: 'cd-record' },
  { name: 'フィギュア', slug: 'figure' },
]

async function main() {
  console.log('=== カテゴリSlug更新スクリプト ===\n')

  for (const update of categoryUpdates) {
    console.log(`「${update.name}」のslugを「${update.slug}」に更新中...`)

    try {
      // 名前でカテゴリを検索
      const category = await prisma.category.findFirst({
        where: { name: update.name },
      })

      if (!category) {
        console.log(`⚠️  「${update.name}」が見つかりません。スキップします。\n`)
        continue
      }

      // slugを更新
      await prisma.category.update({
        where: { id: category.id },
        data: { slug: update.slug },
      })

      console.log(`✅ 成功: ${category.name} (${category.slug} → ${update.slug})\n`)
    } catch (error) {
      console.error(`❌ エラー: ${update.name}の更新に失敗`)
      console.error(error)
      console.log('')
    }
  }

  console.log('=== 完了 ===')
  console.log('\n更新後のカテゴリ一覧:')

  const allCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  allCategories.forEach((cat) => {
    console.log(`  - ${cat.name}: ${cat.slug}`)
  })
}

main()
  .catch((error) => {
    console.error('スクリプト実行エラー:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
