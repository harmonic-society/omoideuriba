import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactFormSchema } from '@/lib/validations/contact'
import { sendContactConfirmation, sendContactNotification } from '@/lib/email'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // バリデーション
    const validatedData = contactFormSchema.parse(body)

    // お問い合わせを保存
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'UNREAD',
      },
    })

    console.log('Contact created:', contact.id)

    // メール送信（非同期、エラーでも処理は継続）
    Promise.all([
      // お客様への自動返信メール
      sendContactConfirmation({
        to: validatedData.email,
        name: validatedData.name,
        subject: validatedData.subject,
        message: validatedData.message,
      }),
      // 管理者への通知メール
      sendContactNotification({
        contactId: contact.id,
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }),
    ]).catch((error) => {
      console.error('Email sending failed:', error)
      // メール送信失敗してもお問い合わせは保存されているので続行
    })

    return NextResponse.json(
      {
        success: true,
        contactId: contact.id,
        message: 'お問い合わせを受け付けました',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'お問い合わせの送信に失敗しました',
      },
      { status: 500 }
    )
  }
}
