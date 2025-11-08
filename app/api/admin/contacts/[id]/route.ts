import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// お問い合わせ詳細取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // 管理者認証チェック
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'お問い合わせが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Get contact error:', error)
    return NextResponse.json(
      { error: 'お問い合わせの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// お問い合わせ更新（ステータス変更、管理メモ追加）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // 管理者認証チェック
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, adminNote } = body

    // 既存のお問い合わせを取得
    const existing = await prisma.contact.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'お問い合わせが見つかりません' },
        { status: 404 }
      )
    }

    // 更新
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status: status || existing.status,
        adminNote: adminNote !== undefined ? adminNote : existing.adminNote,
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'お問い合わせの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// お問い合わせ削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    // 管理者認証チェック
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.contact.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'お問い合わせを削除しました' })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { error: 'お問い合わせの削除に失敗しました' },
      { status: 500 }
    )
  }
}
