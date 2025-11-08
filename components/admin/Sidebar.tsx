'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'ダッシュボード', href: '/admin', icon: '📊' },
    { name: '商品管理', href: '/admin/products', icon: '📦' },
    { name: 'カテゴリ管理', href: '/admin/categories', icon: '🏷️' },
    { name: '注文管理', href: '/admin/orders', icon: '🛒' },
    { name: 'ユーザー管理', href: '/admin/users', icon: '👥' },
  ]

  return (
    <aside className="w-64 bg-retro-pink border-r-4 border-vintage-brown min-h-screen">
      <div className="p-6">
        <Link href="/admin">
          <h2 className="text-2xl font-bold text-white font-pixel mb-8">
            管理画面
          </h2>
        </Link>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-retro font-bold transition-all ${
                  isActive
                    ? 'bg-white text-retro-pink shadow-md'
                    : 'text-white hover:bg-white/20'
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
            className="flex items-center gap-3 px-4 py-3 rounded-retro font-bold text-white hover:bg-white/20 transition-all"
          >
            <span className="text-2xl">🏠</span>
            <span>サイトに戻る</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
