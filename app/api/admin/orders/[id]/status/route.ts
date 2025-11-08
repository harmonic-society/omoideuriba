import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth()

    // 管理者チェック
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // バリデーション
    const { status } = updateStatusSchema.parse(body)

    // 注文を取得
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json(
        { error: '注文が見つかりません' },
        { status: 404 }
      )
    }

    // ステータスを更新
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      message: 'ステータスを更新しました',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
      },
    })
  } catch (error) {
    console.error('Update order status error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '無効なステータスです', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'ステータス更新に失敗しました' },
      { status: 500 }
    )
  }
}
