import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/validations/profile'
import { ZodError } from 'zod'

// プロフィール取得
export async function GET() {
  try {
    const user = await requireAuth()

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        postalCode: true,
        prefecture: true,
        city: true,
        addressLine1: true,
        addressLine2: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'プロフィール取得に失敗しました' },
      { status: 500 }
    )
  }
}

// プロフィール更新
export async function PUT(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    // Zodバリデーション
    const validatedData = profileUpdateSchema.parse(body)

    const {
      name,
      email,
      phoneNumber,
      postalCode,
      prefecture,
      city,
      address: addressLine1,
      building: addressLine2,
      image,
    } = validatedData

    // メールアドレスが変更された場合、重複チェック
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'このメールアドレスは既に使用されています', field: 'email' },
          { status: 400 }
        )
      }
    }

    // プロフィール更新
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        phoneNumber: phoneNumber || null,
        postalCode: postalCode || null,
        prefecture: prefecture || null,
        city: city || null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        postalCode: true,
        prefecture: true,
        city: true,
        addressLine1: true,
        addressLine2: true,
        image: true,
      },
    })

    return NextResponse.json({
      message: 'プロフィールを更新しました',
      user: updatedUser,
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

    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'プロフィール更新に失敗しました' },
      { status: 500 }
    )
  }
}
