import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { createPayPalOrder } from '@/lib/paypal'
import { createOrderSchema } from '@/lib/validations/checkout'
import { checkMultipleStock } from '@/lib/inventory'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // バリデーション
    const orderData = createOrderSchema.parse(body)

    // サーバーサイドで金額を再計算（改ざん防止）
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: orderData.items.map((item) => item.productId),
        },
      },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    // 金額検証
    let calculatedSubtotal = 0
    const validatedItems = []

    for (const item of orderData.items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `商品が見つかりません: ${item.productId}` },
          { status: 400 }
        )
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `${product.name}は現在販売していません` },
          { status: 400 }
        )
      }

      const productPrice = Number(product.price.toString())
      calculatedSubtotal += productPrice * item.quantity

      validatedItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: productPrice,
      })
    }

    const calculatedTotal = calculatedSubtotal + orderData.shippingFee

    // 送信された金額と再計算した金額を比較
    if (Math.abs(calculatedTotal - orderData.totalAmount) > 0.01) {
      return NextResponse.json(
        {
          error: '金額が一致しません',
          calculated: calculatedTotal,
          received: orderData.totalAmount,
        },
        { status: 400 }
      )
    }

    // 在庫確認
    const stockCheck = await checkMultipleStock(
      validatedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    )

    if (!stockCheck.allAvailable) {
      return NextResponse.json(
        {
          error: '在庫不足の商品があります',
          unavailableProducts: stockCheck.unavailableProducts,
        },
        { status: 400 }
      )
    }

    // PayPal注文を作成
    const paypalOrder = await createPayPalOrder({
      amount: calculatedTotal,
      items: validatedItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.price,
      })),
      shippingFee: orderData.shippingFee,
    })

    return NextResponse.json({
      orderId: paypalOrder.id,
      status: paypalOrder.status,
    })
  } catch (error) {
    console.error('Create PayPal order error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'PayPal注文の作成に失敗しました' },
      { status: 500 }
    )
  }
}
