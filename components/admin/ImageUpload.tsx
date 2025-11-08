'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onKeyChange?: (key: string) => void
}

export default function ImageUpload({ value, onChange, onKeyChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setError('')

    // 画像ファイルチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルのみアップロード可能です')
      return
    }

    // ファイルサイズチェック（10MB）
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズは10MB以下にしてください')
      return
    }

    try {
      setUploading(true)
      setProgress(0)

      // プレビュー表示
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // アップロードURL取得
      console.log('Requesting upload URL for:', file.name, file.type)
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      })

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json()
        console.error('Upload URL error:', data)
        throw new Error(data.error || 'アップロードURLの取得に失敗しました')
      }

      const { uploadUrl, publicUrl, key } = await uploadResponse.json()
      console.log('Upload URL received:', { publicUrl, key })

      // S3にアップロード
      console.log('Starting S3 upload...')
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setProgress(percentComplete)
        }
      })

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          console.log('S3 upload response:', xhr.status, xhr.statusText)
          if (xhr.status === 200) {
            console.log('S3 upload successful')
            resolve()
          } else {
            console.error('S3 upload failed:', xhr.status, xhr.responseText)
            reject(new Error(`アップロードに失敗しました (${xhr.status}): ${xhr.statusText}`))
          }
        }
        xhr.onerror = () => {
          console.error('S3 upload error')
          reject(new Error('アップロードに失敗しました'))
        }

        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      // 成功時の処理
      onChange(publicUrl)
      if (onKeyChange) {
        onKeyChange(key)
      }
      setProgress(100)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (onKeyChange) {
      onKeyChange('')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md rounded-retro border-4 border-vintage-brown"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-2 rounded-retro font-bold hover:bg-red-600 transition-colors"
          >
            ✕ 削除
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-4 border-dashed rounded-retro p-12 text-center transition-colors ${
            dragActive
              ? 'border-retro-pink bg-retro-pink/10'
              : 'border-vintage-brown hover:border-retro-blue'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <p className="text-vintage-brown font-bold">
              画像をドラッグ＆ドロップ
            </p>
            <p className="text-vintage-brown/70 text-sm">または</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-retro-blue"
            >
              ファイルを選択
            </button>
            <p className="text-xs text-vintage-brown/60">
              JPG, PNG, GIF（最大10MB）
            </p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-vintage-brown">
            <span>アップロード中...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-vintage-brown/20 rounded-retro h-4 overflow-hidden">
            <div
              className="bg-retro-blue h-full transition-all duration-300 rounded-retro"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro">
          {error}
        </div>
      )}
    </div>
  )
}
