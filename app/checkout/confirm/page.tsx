'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useCartStore } from '@/lib/store/cart'
import OrderSummary from '@/components/checkout/OrderSummary'
import Link from 'next/link'
import type { ShippingAddress } from '@/lib/validations/checkout'
import type { CartItem } from '@/lib/store/cart'

const SHIPPING_FEE = 500

export default function ConfirmOrderPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, clearCart } = useCartStore()
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  // 認証チェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout/confirm')
    }
  }, [status, router])

  // セッションストレージからデータを取得
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('shippingAddress')
    const savedItems = sessionStorage.getItem('checkoutItems')

    if (!savedAddress || !savedItems) {
      router.push('/checkout')
      return
    }

    try {
      setShippingAddress(JSON.parse(savedAddress))
      setCheckoutItems(JSON.parse(savedItems))
    } catch (err) {
      console.error('Failed to parse session data:', err)
      router.push('/checkout')
    }
  }, [router])

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + SHIPPING_FEE

  const handleCreateOrder = async () => {
    console.log('=== Creating PayPal Order ===')
    console.log('Shipping Address:', shippingAddress)
    console.log('Checkout Items:', checkoutItems)
    console.log('Total:', total)

    if (!shippingAddress) {
      console.error('Shipping address is missing')
      throw new Error('配送先情報がありません')
    }

    setError('')

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          shippingFee: SHIPPING_FEE,
          totalAmount: total,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Create order failed:', data)
        throw new Error(data.error || 'PayPal注文の作成に失敗しました')
      }

      const data = await response.json()
      console.log('PayPal order created successfully:', data.orderId)
      return data.orderId
    } catch (error) {
      console.error('Create order exception:', error)
      throw error
    }
  }

  const handleApprove = async (data: any) => {
    console.log('=== Approving PayPal Payment ===')
    console.log('PayPal Order ID:', data.orderID)

    if (!shippingAddress) {
      console.error('Shipping address is missing during approval')
      setError('配送先情報がありません')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          orderData: {
            items: checkoutItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress,
            shippingFee: SHIPPING_FEE,
            totalAmount: total,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Capture order failed:', errorData)
        throw new Error(errorData.error || '注文の確定に失敗しました')
      }

      const result = await response.json()
      console.log('Order captured successfully:', result)

      // セッションストレージをクリア
      sessionStorage.removeItem('shippingAddress')
      sessionStorage.removeItem('checkoutItems')
      sessionStorage.removeItem('shippingFee')

      // カートをクリア
      clearCart()

      // 成功ページへ
      router.push(`/checkout/success?orderId=${result.orderId}`)
    } catch (err) {
      console.error('Order capture error:', err)
      setError(err instanceof Error ? err.message : '注文の確定に失敗しました')
      setProcessing(false)
    }
  }

  const handleError = (err: any) => {
    console.error('=== PayPal Error ===')
    console.error('Error details:', err)
    console.error('Error type:', typeof err)
    console.error('Error message:', err?.message || 'No message')

    const errorMessage = err?.message || err?.toString() || 'PayPal決済でエラーが発生しました'
    setError(`PayPalエラー: ${errorMessage}`)
  }

  // PayPal SDKの読み込みを確認
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('PayPal Client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'Set' : 'Not set')
      console.log('Agreed to terms:', agreedToTerms)
      console.log('Processing:', processing)
      console.log('Checkout items count:', checkoutItems.length)
    }
  }, [agreedToTerms, processing, checkoutItems])

  if (status === 'loading' || !shippingAddress || checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
        <div className="text-vintage-brown text-xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-4 font-pixel">
          注文内容の確認
        </h1>

        {/* プログレスバー */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/cart" className="text-retro-blue hover:underline">
            カート
          </Link>
          <span className="text-vintage-brown">→</span>
          <Link href="/checkout" className="text-retro-blue hover:underline">
            お届け先入力
          </Link>
          <span className="text-vintage-brown">→</span>
          <span className="font-bold text-vintage-brown">注文確認</span>
          <span className="text-vintage-brown">→</span>
          <span className="text-vintage-brown/50">完了</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
          <p className="font-bold mb-2">エラー</p>
          <p>{error}</p>
        </div>
      )}

      {processing && (
        <div className="bg-retro-blue/20 border-2 border-retro-blue text-retro-blue px-4 py-3 rounded-retro mb-6">
          <p className="font-bold">処理中...</p>
          <p className="text-sm">注文を確定しています。しばらくお待ちください。</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側: 配送先情報と利用規約 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 配送先情報 */}
          <div className="card-retro">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-vintage-brown font-pixel">
                お届け先
              </h2>
              <Link
                href="/checkout"
                className="text-retro-blue hover:underline text-sm font-bold"
              >
                変更
              </Link>
            </div>

            <div className="space-y-2 text-vintage-brown">
              <p className="font-bold text-lg">{shippingAddress.name}</p>
              <p>〒{shippingAddress.postalCode}</p>
              <p>
                {shippingAddress.prefecture}
                {shippingAddress.city}
                {shippingAddress.addressLine1}
              </p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>電話: {shippingAddress.phoneNumber}</p>
            </div>
          </div>

          {/* 利用規約 */}
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              利用規約
            </h2>

            <div className="mb-4 p-4 bg-vintage-cream border-2 border-vintage-brown rounded-retro max-h-60 overflow-y-auto text-sm text-vintage-brown">
              <h3 className="font-bold mb-2">第1条（適用）</h3>
              <p className="mb-4">
                本規約は、当店が提供するサービスの利用に関する条件を定めるものです。
              </p>

              <h3 className="font-bold mb-2">第2条（返品・交換）</h3>
              <p className="mb-4">
                商品到着後7日以内に限り、未使用・未開封の商品に限り返品を承ります。
              </p>

              <h3 className="font-bold mb-2">第3条（配送）</h3>
              <p className="mb-4">
                配送は日本国内に限ります。お届けまで3-7営業日程度かかります。
              </p>

              <h3 className="font-bold mb-2">第4条（支払い）</h3>
              <p>
                お支払いはPayPalを通じて行われます。クレジットカード、デビットカード、PayPal残高がご利用いただけます。
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-vintage-brown"
                disabled={processing}
              />
              <span className="text-vintage-brown">
                利用規約に同意します <span className="text-retro-pink">*</span>
              </span>
            </label>
          </div>

          {/* PayPalボタン */}
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              お支払い
            </h2>

            {!agreedToTerms && (
              <div className="bg-yellow-100 border-2 border-yellow-600 text-yellow-800 px-4 py-3 rounded-retro mb-4">
                <p className="font-bold">利用規約への同意が必要です</p>
                <p className="text-sm">上記の利用規約に同意してください。</p>
              </div>
            )}

            {agreedToTerms && !processing && (
              <>
                {!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
                    <p className="font-bold">PayPal設定エラー</p>
                    <p className="text-sm">PayPal Client IDが設定されていません。</p>
                  </div>
                )}
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                    currency: 'JPY',
                    intent: 'capture',
                    locale: 'ja_JP',
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect',
                      label: 'paypal',
                    }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onError={handleError}
                    disabled={!agreedToTerms || processing}
                    forceReRender={[agreedToTerms, processing, total]}
                  />
                </PayPalScriptProvider>
              </>
            )}
          </div>
        </div>

        {/* 右側: 注文サマリー */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <OrderSummary items={checkoutItems} shippingFee={SHIPPING_FEE} />
          </div>
        </div>
      </div>
    </div>
  )
}
