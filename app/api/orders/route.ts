import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// ユーザーの注文一覧を取得
export async function GET(request: Request) {
  try {
    const user = await requireAuth()

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Decimalを数値に変換
    const serializedOrders = orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount.toString()),
      shippingFee: Number(order.shippingFee.toString()),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price.toString()),
      })),
    }))

    return NextResponse.json(serializedOrders)
  } catch (error) {
    console.error('Get orders error:', error)

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    return NextResponse.json(
      { error: '注文の取得に失敗しました' },
      { status: 500 }
    )
  }
}
