import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { passwordChangeSchema } from '@/lib/validations/profile'
import { compare, hash } from 'bcryptjs'
import { ZodError } from 'zod'

// パスワード変更
export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Zodバリデーション
    const validatedData = passwordChangeSchema.parse(body)

    const { currentPassword, newPassword } = validatedData

    // 現在のユーザー情報を取得
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 現在のパスワードを確認
    const isValidPassword = await compare(currentPassword, currentUser.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '現在のパスワードが正しくありません', field: 'currentPassword' },
        { status: 400 }
      )
    }

    // 新しいパスワードをハッシュ化
    const hashedPassword = await hash(newPassword, 10)

    // パスワード更新
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      message: 'パスワードを変更しました',
    })
  } catch (error) {
    // Zodバリデーションエラー
    if (error instanceof ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError.message, field: firstError.path[0] },
        { status: 400 }
      )
    }

    console.error('Password change error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'パスワード変更に失敗しました' },
      { status: 500 }
    )
  }
}
