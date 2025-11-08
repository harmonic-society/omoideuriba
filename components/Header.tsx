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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  // モバイルメニューを閉じる
  const closeMobileMenu = () => setShowMobileMenu(false)

  return (
    <header className="bg-retro-pink border-b-4 border-vintage-brown shadow-retro sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-pixel">
              思い出売場
            </h1>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center gap-6">
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
          <div className="flex items-center gap-2 md:gap-4">
            {/* ショッピングカート */}
            <Link href="/cart" className="relative" onClick={closeMobileMenu}>
              <div className="bg-white text-retro-pink px-3 md:px-4 py-2 rounded-retro font-bold hover:bg-retro-yellow hover:text-vintage-brown transition-colors shadow-md text-sm md:text-base">
                <span className="hidden sm:inline">🛒 カート</span>
                <span className="sm:hidden">🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-retro-orange text-white text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* ログイン/アカウント */}
            {status === 'loading' ? (
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 md:gap-2 bg-white px-2 md:px-3 py-2 rounded-retro hover:bg-retro-yellow transition-colors"
                >
                  {session.user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-vintage-brown"
                    />
                  ) : (
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-retro-purple text-white flex items-center justify-center font-bold border-2 border-vintage-brown text-sm md:text-base">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden lg:inline text-vintage-brown font-bold text-sm">
                    {session.user.name || 'ユーザー'}
                  </span>
                  <span className="text-vintage-brown text-xs md:text-sm">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 md:w-52 bg-white border-4 border-vintage-brown rounded-retro shadow-retro z-50">
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
                          className="block px-3 py-2 text-vintage-brown hover:bg-retro-purple hover:text-white font-bold transition-colors rounded text-sm"
                          onClick={() => {
                            setShowDropdown(false)
                            closeMobileMenu()
                          }}
                        >
                          🔧 管理画面
                        </Link>
                      )}

                      <Link
                        href="/account"
                        className="block px-3 py-2 text-vintage-brown hover:bg-retro-blue hover:text-white font-bold transition-colors rounded text-sm"
                        onClick={() => {
                          setShowDropdown(false)
                          closeMobileMenu()
                        }}
                      >
                        ⚙️ アカウント設定
                      </Link>

                      <Link
                        href="/account/orders"
                        className="block px-3 py-2 text-vintage-brown hover:bg-retro-blue hover:text-white font-bold transition-colors rounded text-sm"
                        onClick={() => {
                          setShowDropdown(false)
                          closeMobileMenu()
                        }}
                      >
                        📦 注文履歴
                      </Link>

                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          closeMobileMenu()
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 font-bold transition-colors rounded text-sm"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden md:block bg-white text-retro-pink px-3 md:px-4 py-2 rounded-retro font-bold hover:bg-retro-yellow hover:text-vintage-brown transition-colors shadow-md text-sm md:text-base"
                onClick={closeMobileMenu}
              >
                ログイン
              </Link>
            )}

            {/* ハンバーガーメニュー（モバイル） */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex flex-col gap-1 p-2 bg-white rounded-retro hover:bg-retro-yellow transition-colors"
              aria-label="メニュー"
            >
              <span className={`block w-6 h-0.5 bg-vintage-brown transition-transform ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-6 h-0.5 bg-vintage-brown transition-opacity ${showMobileMenu ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-vintage-brown transition-transform ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {showMobileMenu && (
          <nav className="lg:hidden mt-4 pb-4 border-t-2 border-white/30 pt-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className="text-white hover:text-retro-yellow font-bold transition-colors py-2 px-3 hover:bg-white/10 rounded"
                onClick={closeMobileMenu}
              >
                📦 商品一覧
              </Link>
              <Link
                href="/categories"
                className="text-white hover:text-retro-yellow font-bold transition-colors py-2 px-3 hover:bg-white/10 rounded"
                onClick={closeMobileMenu}
              >
                🏷️ カテゴリ
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-retro-yellow font-bold transition-colors py-2 px-3 hover:bg-white/10 rounded"
                onClick={closeMobileMenu}
              >
                ℹ️ About
              </Link>
              {!session?.user && (
                <Link
                  href="/auth/signin"
                  className="md:hidden text-white hover:text-retro-yellow font-bold transition-colors py-2 px-3 hover:bg-white/10 rounded"
                  onClick={closeMobileMenu}
                >
                  🔐 ログイン
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
