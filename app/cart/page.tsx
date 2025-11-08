'use client'

import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/store/cart'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="card-retro text-center py-12 md:py-16 max-w-2xl mx-auto">
              <div className="text-6xl md:text-8xl mb-4 md:mb-6">🛒</div>
              <h1 className="text-2xl md:text-4xl font-bold text-vintage-brown mb-3 md:mb-4 font-pixel">
                カートは空です
              </h1>
              <p className="text-base md:text-lg text-vintage-brown mb-6 md:mb-8">
                お気に入りの商品を見つけてカートに追加しましょう！
              </p>
              <Link href="/products" className="btn-retro-pink text-base md:text-lg inline-block">
                商品を探す
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-4 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-vintage-brown mb-6 md:mb-8 font-pixel text-center">
            ショッピングカート
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* カートアイテム一覧 */}
            <div className="lg:col-span-2">
              <div className="space-y-3 md:space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="card-retro">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      {/* 商品画像 */}
                      <div className="relative w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 bg-retro-purple/10 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* 商品情報とコントロール */}
                      <div className="flex-grow flex flex-col sm:flex-row gap-3">
                        {/* 商品名と価格 */}
                        <div className="flex-grow">
                          <h3 className="text-base md:text-xl font-bold text-vintage-brown mb-1 md:mb-2">
                            {item.name}
                          </h3>
                          <p className="text-lg md:text-2xl font-bold text-retro-pink mb-2 md:mb-3">
                            ¥{item.price.toLocaleString()}
                          </p>

                          {/* 数量調整 */}
                          <div className="flex items-center gap-2 md:gap-4">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="bg-retro-purple text-white px-3 md:px-4 py-1 md:py-2 rounded-retro font-bold hover:bg-retro-pink transition-colors active:scale-95 text-sm md:text-base"
                            >
                              -
                            </button>
                            <span className="text-base md:text-xl font-bold text-vintage-brown min-w-[2rem] md:min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="bg-retro-purple text-white px-3 md:px-4 py-1 md:py-2 rounded-retro font-bold hover:bg-retro-pink transition-colors active:scale-95 text-sm md:text-base"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="ml-auto text-red-500 hover:text-red-700 font-bold text-sm md:text-base"
                            >
                              🗑️ 削除
                            </button>
                          </div>
                        </div>

                        {/* 小計 (デスクトップのみ) */}
                        <div className="hidden sm:flex flex-col text-right justify-between flex-shrink-0">
                          <p className="text-xs md:text-sm text-vintage-brown mb-1">小計</p>
                          <p className="text-lg md:text-2xl font-bold text-retro-pink">
                            ¥{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* 小計 (モバイル) */}
                      <div className="sm:hidden flex justify-between items-center pt-2 border-t-2 border-vintage-brown">
                        <span className="text-sm text-vintage-brown">小計</span>
                        <span className="text-xl font-bold text-retro-pink">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ショッピングを続けるボタン */}
              <Link href="/products" className="btn-retro-blue mt-4 md:mt-6 inline-block text-sm md:text-base">
                ← ショッピングを続ける
              </Link>
            </div>

            {/* 注文サマリー */}
            <div className="lg:col-span-1">
              <div className="card-retro lg:sticky lg:top-20">
                <h2 className="text-xl md:text-2xl font-bold text-vintage-brown mb-4 md:mb-6 font-pixel">
                  注文サマリー
                </h2>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between text-vintage-brown text-sm md:text-base">
                    <span>小計</span>
                    <span className="font-bold">¥{getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-vintage-brown text-sm md:text-base">
                    <span>配送料</span>
                    <span className="font-bold">¥500</span>
                  </div>
                  <div className="border-t-2 border-vintage-brown pt-2 md:pt-3">
                    <div className="flex justify-between text-xl md:text-2xl font-bold text-retro-pink">
                      <span>合計</span>
                      <span>¥{(getTotal() + 500).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full btn-retro-pink text-center text-base md:text-lg py-3 md:py-4"
                >
                  レジに進む 💳
                </Link>

                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-retro-yellow/20 rounded-retro">
                  <p className="text-xs md:text-sm text-vintage-brown text-center">
                    💳 安全なPayPal決済
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
