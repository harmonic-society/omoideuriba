'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const { items } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const { data: session, status } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            {status === 'loading' ? (
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-retro hover:bg-retro-yellow transition-colors"
                >
                  {session.user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-vintage-brown"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-retro-purple text-white flex items-center justify-center font-bold border-2 border-vintage-brown">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden md:inline text-vintage-brown font-bold">
                    {session.user.name || 'ユーザー'}
                  </span>
                  <span className="text-vintage-brown">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-4 border-vintage-brown rounded-retro shadow-retro z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b-2 border-vintage-brown">
                        <p className="text-xs text-vintage-brown/70">ログイン中</p>
                        <p className="text-sm font-bold text-vintage-brown truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {session.user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-vintage-brown hover:bg-retro-purple hover:text-white font-bold transition-colors rounded"
                          onClick={() => setShowDropdown(false)}
                        >
                          🔧 管理画面
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="block px-3 py-2 text-vintage-brown hover:bg-retro-blue hover:text-white font-bold transition-colors rounded"
                        onClick={() => setShowDropdown(false)}
                      >
                        📦 注文履歴
                      </Link>

                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 font-bold transition-colors rounded"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="hidden md:block text-white hover:text-retro-yellow font-bold transition-colors">
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
