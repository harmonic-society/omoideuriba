import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { generateUploadURL, generateMultipleUploadURLs } from '@/lib/s3'

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { fileName, fileType, files } = body

    // 複数ファイルのアップロード
    if (files && Array.isArray(files)) {
      const uploadData = await generateMultipleUploadURLs(files)
      return NextResponse.json({ uploads: uploadData })
    }

    // 単一ファイルのアップロード
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'ファイル名とファイルタイプが必要です' },
        { status: 400 }
      )
    }

    // 画像ファイルのみ許可
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: '画像ファイルのみアップロード可能です' },
        { status: 400 }
      )
    }

    const uploadData = await generateUploadURL(fileName, fileType)

    return NextResponse.json(uploadData)
  } catch (error) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'アップロードURLの生成に失敗しました' },
      { status: 500 }
    )
  }
}
