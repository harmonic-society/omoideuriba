import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

/**
 * カテゴリのslugを一括更新するAPIエンドポイント
 * 管理者のみ実行可能
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // 管理者チェック
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const categoryUpdates = [
      { name: 'おもちゃ', slug: 'toy' },
      { name: 'ゲーム', slug: 'game' },
      { name: 'CD・レコード', slug: 'cd-record' },
      { name: 'フィギュア', slug: 'figure' },
    ]

    const results = []

    for (const update of categoryUpdates) {
      try {
        // 名前でカテゴリを検索
        const category = await prisma.category.findFirst({
          where: { name: update.name },
        })

        if (!category) {
          results.push({
            name: update.name,
            status: 'not_found',
            message: `カテゴリ「${update.name}」が見つかりません`,
          })
          continue
        }

        // slugを更新
        await prisma.category.update({
          where: { id: category.id },
          data: { slug: update.slug },
        })

        results.push({
          name: update.name,
          status: 'success',
          oldSlug: category.slug,
          newSlug: update.slug,
        })
      } catch (error) {
        results.push({
          name: update.name,
          status: 'error',
          message: error instanceof Error ? error.message : '更新に失敗しました',
        })
      }
    }

    // 更新後のカテゴリ一覧を取得
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })

    return NextResponse.json({
      message: 'カテゴリslugの更新が完了しました',
      results,
      categories: allCategories,
    })
  } catch (error) {
    console.error('Update category slugs error:', error)

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'カテゴリslugの更新に失敗しました' },
      { status: 500 }
    )
  }
}
