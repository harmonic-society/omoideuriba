'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 認証チェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'loading' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
        <div className="text-vintage-brown text-xl">読み込み中...</div>
      </div>
    )
  }

  if (session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex min-h-screen bg-vintage-cream">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0">
        {/* ヘッダー */}
        <div className="bg-retro-purple border-b-4 border-vintage-brown px-4 py-3 md:px-8 md:py-6 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            {/* モバイルメニューボタン + タイトル */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-vintage-brown text-2xl p-2 hover:bg-white/20 rounded-retro flex-shrink-0"
                aria-label="メニューを開く"
              >
                ☰
              </button>
              <h1 className="text-lg md:text-3xl font-bold text-vintage-brown font-pixel truncate">
                思い出売場 CMS
              </h1>
            </div>

            {/* ユーザー情報 */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <span className="hidden sm:inline text-vintage-brown font-bold text-sm md:text-base">
                👤 {session.user.name}
              </span>
              <span className="px-2 md:px-3 py-1 bg-retro-pink text-white rounded-full text-xs md:text-sm font-bold">
                管理者
              </span>
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
