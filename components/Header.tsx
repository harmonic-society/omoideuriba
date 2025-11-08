'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'

export default function Header() {
  const { items } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-retro-pink border-b-4 border-vintage-brown shadow-retro">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-pixel">
              思い出売場
            </h1>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-white hover:text-retro-yellow font-bold transition-colors">
              商品一覧
            </Link>
            <Link href="/categories" className="text-white hover:text-retro-yellow font-bold transition-colors">
              カテゴリ
            </Link>
            <Link href="/about" className="text-white hover:text-retro-yellow font-bold transition-colors">
              About
            </Link>
          </nav>

          {/* 右側メニュー */}
          <div className="flex items-center gap-4">
            {/* ショッピングカート */}
            <Link href="/cart" className="relative">
              <div className="bg-white text-retro-pink px-4 py-2 rounded-retro font-bold hover:bg-retro-yellow hover:text-vintage-brown transition-colors shadow-md">
                🛒 カート
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-retro-orange text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* ログイン/アカウント */}
            <Link href="/auth/signin" className="hidden md:block text-white hover:text-retro-yellow font-bold transition-colors">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
