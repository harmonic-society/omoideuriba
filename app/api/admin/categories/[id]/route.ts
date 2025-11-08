import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// カテゴリ更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { name, slug, description } = body

    // 既存カテゴリチェック
    const existing = await prisma.category.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'カテゴリが見つかりません' }, { status: 404 })
    }

    // slug重複チェック（自分以外）
    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.category.findUnique({ where: { slug } })
      if (duplicate) {
        return NextResponse.json(
          { error: 'このスラッグは既に使用されています' },
          { status: 400 }
        )
      }
    }

    // カテゴリ更新
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        slug: slug || existing.slug,
        description: description !== undefined ? description : existing.description,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'カテゴリの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// カテゴリ削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // 既存カテゴリチェック
    const existing = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'カテゴリが見つかりません' }, { status: 404 })
    }

    // 商品が紐付いている場合は削除不可
    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: `このカテゴリには${existing._count.products}個の商品が紐付いています。先に商品を削除または別のカテゴリに移動してください。` },
        { status: 400 }
      )
    }

    // カテゴリ削除
    await prisma.category.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'カテゴリを削除しました' })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'カテゴリの削除に失敗しました' },
      { status: 500 }
    )
  }
}
