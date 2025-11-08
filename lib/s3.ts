import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function generateUploadURL(fileName: string, fileType: string) {
  const bucket = process.env.AWS_S3_BUCKET
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET is not configured')
  }

  // ファイル名をユニークにする（タイムスタンプ + ランダム文字列）
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `products/${timestamp}-${randomString}-${sanitizedFileName}`

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
  })

  // プレサインドURLを生成（有効期限: 5分）
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

  // 公開URLを生成
  const publicUrl = `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`

  return {
    uploadUrl,
    publicUrl,
    key,
  }
}

export async function generateMultipleUploadURLs(files: Array<{ name: string; type: string }>) {
  const urls = await Promise.all(
    files.map((file) => generateUploadURL(file.name, file.type))
  )
  return urls
}
