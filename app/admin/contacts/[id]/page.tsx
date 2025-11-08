'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'IN_PROGRESS' | 'RESOLVED'
  adminNote: string | null
  createdAt: string
  updatedAt: string
}

const statusLabels = {
  UNREAD: '未読',
  READ: '既読',
  IN_PROGRESS: '対応中',
  RESOLVED: '解決済み',
}

export default function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [error, setError] = useState('')
  const [id, setId] = useState('')

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
      fetchContact(p.id)
    })
  }, [params])

  const fetchContact = async (contactId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/contacts/${contactId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch contact')
      }

      const data = await response.json()
      setContact(data)
      setSelectedStatus(data.status)
      setAdminNote(data.adminNote || '')

      // 未読の場合は既読に自動更新
      if (data.status === 'UNREAD') {
        await updateStatus(contactId, 'READ', data.adminNote)
      }
    } catch (error) {
      console.error('Fetch contact error:', error)
      setError('お問い合わせの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    contactId: string,
    status: string,
    note: string | null
  ) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNote: note,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update contact')
      }

      const data = await response.json()
      setContact(data)
      setSelectedStatus(data.status)
    } catch (error) {
      console.error('Update contact error:', error)
      throw error
    }
  }

  const handleUpdate = async () => {
    if (!id) return

    try {
      setUpdating(true)
      setError('')

      await updateStatus(id, selectedStatus, adminNote)

      alert('更新しました')
    } catch (error) {
      console.error('Update error:', error)
      setError('更新に失敗しました')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    if (!confirm('このお問い合わせを削除してもよろしいですか？')) {
      return
    }

    try {
      setUpdating(true)
      setError('')

      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      alert('削除しました')
      router.push('/admin/contacts')
    } catch (error) {
      console.error('Delete error:', error)
      setError('削除に失敗しました')
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <div className="text-vintage-brown text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-4 md:p-8">
        <div className="card-retro text-center py-12">
          <p className="text-vintage-brown text-lg mb-4">
            お問い合わせが見つかりません
          </p>
          <Link
            href="/admin/contacts"
            className="btn-retro-blue inline-block text-sm md:text-base"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-6">
        <Link
          href="/admin/contacts"
          className="text-retro-blue hover:underline text-sm md:text-base mb-4 inline-block"
        >
          ← お問い合わせ一覧に戻る
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-vintage-brown font-pixel">
          お問い合わせ詳細
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* お問い合わせ内容 */}
        <div className="card-retro">
          <h2 className="text-lg md:text-xl font-bold text-vintage-brown mb-4">
            お問い合わせ内容
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-1">
                受付日時
              </label>
              <p className="text-sm md:text-base text-vintage-brown">
                {formatDate(contact.createdAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-1">
                お名前
              </label>
              <p className="text-sm md:text-base text-vintage-brown">{contact.name}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-1">
                メールアドレス
              </label>
              <p className="text-sm md:text-base text-vintage-brown">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-retro-blue hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-1">
                件名
              </label>
              <p className="text-sm md:text-base text-vintage-brown">
                {contact.subject}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-1">
                お問い合わせ内容
              </label>
              <div className="p-4 bg-vintage-cream border-2 border-vintage-brown rounded-retro text-sm md:text-base text-vintage-brown whitespace-pre-wrap">
                {contact.message}
              </div>
            </div>
          </div>
        </div>

        {/* ステータス管理 */}
        <div className="card-retro">
          <h2 className="text-lg md:text-xl font-bold text-vintage-brown mb-4">
            ステータス管理
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-2">
                ステータス
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-retro w-full text-sm md:text-base"
                disabled={updating}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-vintage-brown mb-2">
                管理メモ
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={6}
                className="input-retro w-full text-sm md:text-base resize-y"
                disabled={updating}
                placeholder="対応内容や備考をメモできます（お客様には表示されません）"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className={`flex-1 py-3 rounded-retro font-bold text-sm md:text-base transition-all ${
                  updating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-retro-blue text-white hover:shadow-retro active:scale-95'
                }`}
              >
                {updating ? '更新中...' : '更新する'}
              </button>

              <button
                onClick={handleDelete}
                disabled={updating}
                className={`flex-1 sm:flex-none py-3 px-6 rounded-retro font-bold text-sm md:text-base transition-all ${
                  updating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:shadow-retro active:scale-95'
                }`}
              >
                削除
              </button>
            </div>
          </div>
        </div>

        {/* 更新履歴 */}
        <div className="card-retro bg-retro-purple/5">
          <h2 className="text-base md:text-lg font-bold text-vintage-brown mb-3">
            更新履歴
          </h2>
          <p className="text-xs md:text-sm text-vintage-brown">
            最終更新: {formatDate(contact.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
