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

interface ContactsData {
  contacts: Contact[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  counts: {
    UNREAD: number
    READ: number
    IN_PROGRESS: number
    RESOLVED: number
  }
}

const statusLabels = {
  UNREAD: '未読',
  READ: '既読',
  IN_PROGRESS: '対応中',
  RESOLVED: '解決済み',
}

const statusColors = {
  UNREAD: 'bg-retro-pink text-white',
  READ: 'bg-retro-blue text-white',
  IN_PROGRESS: 'bg-retro-yellow text-vintage-brown',
  RESOLVED: 'bg-gray-400 text-white',
}

export default function AdminContactsPage() {
  const router = useRouter()
  const [data, setData] = useState<ContactsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchContacts()
  }, [selectedStatus, currentPage])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/contacts?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Fetch contacts error:', error)
    } finally {
      setLoading(false)
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

  if (loading && !data) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <div className="text-vintage-brown text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-vintage-brown mb-4 font-pixel">
          お問い合わせ管理
        </h1>

        {/* ステータスカウント */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="card-retro p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-retro-pink mb-1">
                {data.counts.UNREAD}
              </div>
              <div className="text-xs md:text-sm text-vintage-brown">未読</div>
            </div>
            <div className="card-retro p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-retro-blue mb-1">
                {data.counts.READ}
              </div>
              <div className="text-xs md:text-sm text-vintage-brown">既読</div>
            </div>
            <div className="card-retro p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-retro-yellow mb-1">
                {data.counts.IN_PROGRESS}
              </div>
              <div className="text-xs md:text-sm text-vintage-brown">対応中</div>
            </div>
            <div className="card-retro p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-600 mb-1">
                {data.counts.RESOLVED}
              </div>
              <div className="text-xs md:text-sm text-vintage-brown">解決済み</div>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedStatus('all')
              setCurrentPage(1)
            }}
            className={`px-3 md:px-4 py-2 rounded-retro font-bold text-sm md:text-base transition-colors ${
              selectedStatus === 'all'
                ? 'bg-retro-purple text-white'
                : 'bg-white text-vintage-brown border-2 border-vintage-brown hover:bg-retro-purple/10'
            }`}
          >
            すべて
          </button>
          {Object.entries(statusLabels).map(([value, label]) => (
            <button
              key={value}
              onClick={() => {
                setSelectedStatus(value)
                setCurrentPage(1)
              }}
              className={`px-3 md:px-4 py-2 rounded-retro font-bold text-sm md:text-base transition-colors ${
                selectedStatus === value
                  ? 'bg-retro-purple text-white'
                  : 'bg-white text-vintage-brown border-2 border-vintage-brown hover:bg-retro-purple/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* お問い合わせ一覧 */}
      {data && data.contacts.length === 0 ? (
        <div className="card-retro text-center py-12">
          <p className="text-vintage-brown text-lg">お問い合わせがありません</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:space-y-4">
            {data?.contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/admin/contacts/${contact.id}`}
                className="card-retro block hover:shadow-retro-hover transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                  {/* ステータスバッジ */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                        statusColors[contact.status]
                      }`}
                    >
                      {statusLabels[contact.status]}
                    </span>
                  </div>

                  {/* お問い合わせ情報 */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-bold text-vintage-brown truncate">
                        {contact.subject}
                      </h3>
                      <span className="text-xs md:text-sm text-vintage-brown/70 flex-shrink-0">
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 text-xs md:text-sm text-vintage-brown">
                      <span className="font-bold">{contact.name}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="text-vintage-brown/70">{contact.email}</span>
                    </div>

                    <p className="text-xs md:text-sm text-vintage-brown/70 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>

                  {/* 矢印 */}
                  <div className="flex-shrink-0 self-center md:self-start">
                    <span className="text-retro-purple text-xl md:text-2xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ページネーション */}
          {data && data.pagination.totalPages > 1 && (
            <div className="mt-6 md:mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 md:px-4 py-2 rounded-retro font-bold text-sm md:text-base bg-white text-vintage-brown border-2 border-vintage-brown hover:bg-retro-purple/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前へ
              </button>

              <span className="text-vintage-brown text-sm md:text-base font-bold px-3">
                {currentPage} / {data.pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={currentPage === data.pagination.totalPages}
                className="px-3 md:px-4 py-2 rounded-retro font-bold text-sm md:text-base bg-white text-vintage-brown border-2 border-vintage-brown hover:bg-retro-purple/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
