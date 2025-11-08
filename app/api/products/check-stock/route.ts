import { NextResponse } from 'next/server'
import { checkMultipleStock } from '@/lib/inventory'
import { z } from 'zod'

const requestSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items } = requestSchema.parse(body)

    const result = await checkMultipleStock(items)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Stock check error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'リクエストが不正です', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '在庫確認に失敗しました' },
      { status: 500 }
    )
  }
}
