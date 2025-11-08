import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations/auth'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Zodバリデーション
    const validatedData = signUpSchema.parse(body)

    const {
      name,
      email,
      password,
      phoneNumber,
      postalCode,
      prefecture,
      city,
      address,
      building,
    } = validatedData

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に使用されています' },
        { status: 400 }
      )
    }

    // パスワードハッシュ化
    const hashedPassword = await hash(password, 10)

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        postalCode: postalCode || null,
        prefecture: prefecture || null,
        city: city || null,
        address: address || null,
        building: building || null,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Zodバリデーションエラー
    if (error instanceof ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { error: firstError.message, field: firstError.path[0] },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
}
