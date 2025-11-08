import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 警告: このエンドポイントは初回セットアップ用です。
// 管理者作成後は必ず削除してください！
export async function POST(request: Request) {
  try {
    // セキュリティ: シークレットキーをチェック
    const body = await request.json()
    const { secret, email } = body

    // デバッグ用: 環境変数の存在確認
    if (!process.env.SETUP_SECRET) {
      return NextResponse.json(
        { error: 'SETUP_SECRET環境変数が設定されていません。Renderの環境変数を確認してください。' },
        { status: 500 }
      )
    }

    // 環境変数でシークレットを設定
    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json(
        {
          error: '認証に失敗しました',
          hint: 'シークレットキーが一致しません'
        },
        { status: 403 }
      )
    }

    // メールアドレスが指定されている場合、そのユーザーを管理者に
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })

      return NextResponse.json({
        message: `${updated.email} を管理者に昇格しました`,
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role,
        },
      })
    }

    // メールアドレスが指定されていない場合、最初のユーザーを管理者に
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      take: 1,
    })

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'ユーザーが存在しません。先にサインアップしてください。' },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { id: users[0].id },
      data: { role: 'ADMIN' },
    })

    return NextResponse.json({
      message: `${updated.email} を管理者に昇格しました`,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
      },
    })
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '管理者作成に失敗しました' },
      { status: 500 }
    )
  }
}

// 既存のユーザー一覧を取得
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const secret = url.searchParams.get('secret')

    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ユーザー取得に失敗しました' },
      { status: 500 }
    )
  }
}
