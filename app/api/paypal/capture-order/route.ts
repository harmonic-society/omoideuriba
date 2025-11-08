import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { capturePayPalOrder } from '@/lib/paypal'
import { prisma } from '@/lib/prisma'
import { decrementOrderStock } from '@/lib/inventory'
import { capturePayPalOrderSchema } from '@/lib/validations/checkout'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { paypalOrderId, orderData } = capturePayPalOrderSchema.parse(body)

    // PayPal支払いを確定
    const captureData = await capturePayPalOrder(paypalOrderId)

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: '支払いが完了していません', status: captureData.status },
        { status: 400 }
      )
    }

    // データベーストランザクション: 注文作成 + 在庫減算
    const order = await prisma.$transaction(async (tx) => {
      // 在庫を減算
      await decrementOrderStock(
        orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )

      // 注文を作成
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          paypalOrderId: paypalOrderId,
          totalAmount: orderData.totalAmount,
          shippingFee: orderData.shippingFee,
          status: 'PENDING',

          // 配送先情報
          shippingName: orderData.shippingAddress.name,
          shippingPostalCode: orderData.shippingAddress.postalCode,
          shippingPrefecture: orderData.shippingAddress.prefecture,
          shippingCity: orderData.shippingAddress.city,
          shippingAddressLine1: orderData.shippingAddress.addressLine1,
          shippingAddressLine2: orderData.shippingAddress.addressLine2 || null,
          shippingPhoneNumber: orderData.shippingAddress.phoneNumber,

          // 注文アイテム
          items: {
            create: orderData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error('Capture PayPal order error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: '注文の確定に失敗しました' },
      { status: 500 }
    )
  }
}
