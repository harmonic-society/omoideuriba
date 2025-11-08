import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

// ユーザー一覧取得
export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ユーザー取得に失敗しました' },
      { status: 500 }
    )
  }
}
