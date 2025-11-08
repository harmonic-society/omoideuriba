import { prisma } from '../lib/prisma'

async function main() {
  try {
    console.log('データベース接続を確認中...')

    // カテゴリを取得
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log(`\n✅ カテゴリ数: ${categories.length}件\n`)

    if (categories.length === 0) {
      console.log('⚠️  カテゴリが存在しません。カテゴリを追加してください。\n')
      console.log('対処方法:')
      console.log('1. http://localhost:3000/admin/categories にアクセス')
      console.log('2. 「新しいカテゴリを追加」ボタンをクリック')
      console.log('3. カテゴリ情報を入力して作成\n')
    } else {
      console.log('カテゴリ一覧:')
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (${cat.slug}) - 商品数: ${cat._count.products}`)
      })
      console.log('')
    }

  } catch (error) {
    console.error('❌ エラー:', error)
    if (error instanceof Error) {
      console.error('詳細:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
