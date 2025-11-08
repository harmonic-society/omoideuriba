import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// ユーザーロール更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { role } = body

    // バリデーション
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: '有効なロールを指定してください' },
        { status: 400 }
      )
    }

    // ユーザー存在確認
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // ロール更新
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ユーザー更新に失敗しました' },
      { status: 500 }
    )
  }
}
