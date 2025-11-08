'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'
import ShippingForm from '@/components/checkout/ShippingForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import Link from 'next/link'
import type { ShippingAddress } from '@/lib/validations/checkout'

const SHIPPING_FEE = 500

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialData, setInitialData] = useState<Partial<ShippingAddress>>({})

  // 認証チェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout')
    }
  }, [status, router])

  // カートが空の場合はカートページへリダイレクト
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  // ユーザー情報から配送先を初期化
  useEffect(() => {
    if (session?.user) {
      setInitialData({
        name: session.user.name || '',
        postalCode: session.user.postalCode || '',
        prefecture: session.user.prefecture || '',
        city: session.user.city || '',
        addressLine1: session.user.addressLine1 || '',
        addressLine2: session.user.addressLine2 || '',
        phoneNumber: session.user.phoneNumber || '',
      })
    }
  }, [session])

  const handleShippingSubmit = async (shippingAddress: ShippingAddress) => {
    setLoading(true)
    setError('')

    try {
      // 在庫確認
      const stockCheck = await fetch('/api/products/check-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!stockCheck.ok) {
        const data = await stockCheck.json()
        throw new Error(data.error || '在庫確認に失敗しました')
      }

      const stockData = await stockCheck.json()

      if (!stockData.allAvailable) {
        const unavailable = stockData.unavailableProducts
          .map((p: any) => p.message)
          .join('\n')
        throw new Error(`在庫不足の商品があります:\n${unavailable}`)
      }

      // 配送先情報をセッションストレージに保存
      sessionStorage.setItem('shippingAddress', JSON.stringify(shippingAddress))
      sessionStorage.setItem('checkoutItems', JSON.stringify(items))
      sessionStorage.setItem('shippingFee', SHIPPING_FEE.toString())

      // 注文確認ページへ
      router.push('/checkout/confirm')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
        <div className="text-vintage-brown text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!session || items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-4 font-pixel">
          お届け先情報
        </h1>

        {/* プログレスバー */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/cart" className="text-retro-blue hover:underline">
            カート
          </Link>
          <span className="text-vintage-brown">→</span>
          <span className="font-bold text-vintage-brown">お届け先入力</span>
          <span className="text-vintage-brown">→</span>
          <span className="text-vintage-brown/50">注文確認</span>
          <span className="text-vintage-brown">→</span>
          <span className="text-vintage-brown/50">完了</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
          <p className="font-bold mb-2">エラー</p>
          <p className="whitespace-pre-line">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 配送先フォーム */}
        <div className="lg:col-span-2">
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-6 font-pixel">
              配送先住所
            </h2>
            <ShippingForm
              initialData={initialData}
              onSubmit={handleShippingSubmit}
              loading={loading}
            />
          </div>

          {/* 注意事項 */}
          <div className="mt-6 p-4 bg-retro-purple/10 border-2 border-vintage-brown rounded-retro">
            <h3 className="font-bold text-vintage-brown mb-2">📝 ご注意</h3>
            <ul className="text-sm text-vintage-brown space-y-1 list-disc list-inside">
              <li>配送先情報は正確にご入力ください</li>
              <li>お届けまでの目安は3-7営業日です</li>
              <li>配送は日本国内のみとなります</li>
            </ul>
          </div>
        </div>

        {/* 注文サマリー */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <OrderSummary items={items} shippingFee={SHIPPING_FEE} />
          </div>
        </div>
      </div>
    </div>
  )
}
