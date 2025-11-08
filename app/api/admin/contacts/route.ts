import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// お問い合わせ一覧取得
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 管理者認証チェック
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // UNREAD, READ, IN_PROGRESS, RESOLVED
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // フィルター条件
    const where = status ? { status: status as any } : {}

    // お問い合わせ一覧を取得
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    // ステータス別カウント
    const statusCounts = await prisma.contact.groupBy({
      by: ['status'],
      _count: true,
    })

    const counts = {
      UNREAD: 0,
      READ: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
    }

    statusCounts.forEach((item) => {
      counts[item.status as keyof typeof counts] = item._count
    })

    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      counts,
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'お問い合わせの取得に失敗しました' },
      { status: 500 }
    )
  }
}
