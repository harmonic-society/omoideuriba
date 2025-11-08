'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'ダッシュボード', href: '/admin', icon: '📊' },
    { name: '商品管理', href: '/admin/products', icon: '📦' },
    { name: 'カテゴリ管理', href: '/admin/categories', icon: '🏷️' },
    { name: '注文管理', href: '/admin/orders', icon: '🛒' },
    { name: 'ユーザー管理', href: '/admin/users', icon: '👥' },
    { name: 'お問い合わせ', href: '/admin/contacts', icon: '✉️' },
  ]

  return (
    <>
      {/* オーバーレイ（モバイル時のみ） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-retro-pink border-r-4 border-vintage-brown min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 md:p-6">
          {/* モバイル用閉じるボタン */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <Link href="/admin" onClick={() => onClose()}>
              <h2 className="text-xl md:text-2xl font-bold text-white font-pixel">
                管理画面
              </h2>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden text-white text-2xl p-2 hover:bg-white/20 rounded-retro"
              aria-label="メニューを閉じる"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-retro font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-white text-retro-pink shadow-md'
                      : 'text-white hover:bg-white/20 active:bg-white/30'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t-2 border-white/30">
            <Link
              href="/"
              onClick={() => onClose()}
              className="flex items-center gap-3 px-4 py-3 rounded-retro font-bold text-white hover:bg-white/20 active:bg-white/30 transition-all min-h-[44px]"
            >
              <span className="text-2xl">🏠</span>
              <span>サイトに戻る</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
