import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// 注文詳細を取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        userId: true,
        paypalOrderId: true,
        totalAmount: true,
        shippingFee: true,
        status: true,
        shippingName: true,
        shippingPostalCode: true,
        shippingPrefecture: true,
        shippingCity: true,
        shippingAddressLine1: true,
        shippingAddressLine2: true,
        shippingPhoneNumber: true,
        createdAt: true,
        updatedAt: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: '注文が見つかりません' }, { status: 404 })
    }

    // 自分の注文かチェック
    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'この注文にアクセスする権限がありません' },
        { status: 403 }
      )
    }

    // Decimalを数値に変換
    const serializedOrder = {
      ...order,
      totalAmount: Number(order.totalAmount.toString()),
      shippingFee: Number(order.shippingFee.toString()),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price.toString()),
      })),
    }

    return NextResponse.json(serializedOrder)
  } catch (error) {
    console.error('Get order detail error:', error)

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    return NextResponse.json(
      { error: '注文詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}
