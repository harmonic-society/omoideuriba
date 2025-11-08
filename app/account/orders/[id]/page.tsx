'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
  }
}

interface Order {
  id: string
  totalAmount: number
  shippingFee: number
  status: string
  createdAt: string
  shippingName: string
  shippingPostalCode: string
  shippingPrefecture: string
  shippingCity: string
  shippingAddressLine1: string
  shippingAddressLine2: string | null
  shippingPhoneNumber: string
  items: OrderItem[]
}

const statusLabels: Record<string, string> = {
  PENDING: '処理中',
  PROCESSING: '発送準備中',
  SHIPPED: '発送済み',
  DELIVERED: '配達完了',
  CANCELLED: 'キャンセル',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/orders')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, params.id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('注文が見つかりません')
        }
        throw new Error('注文の取得に失敗しました')
      }
      const data = await res.json()
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
        <div className="text-vintage-brown text-xl">読み込み中...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-retro text-center py-16">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-vintage-brown mb-4">
            {error || '注文が見つかりません'}
          </h2>
          <Link href="/account/orders" className="btn-retro-blue inline-block">
            注文履歴に戻る
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-4 font-pixel">
          注文詳細
        </h1>
        <Link href="/account/orders" className="text-retro-blue hover:underline">
          ← 注文履歴に戻る
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* 注文情報 */}
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              注文情報
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-vintage-brown/70">注文番号</p>
                <p className="font-mono text-sm text-vintage-brown break-all">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-vintage-brown/70">注文日</p>
                <p className="font-bold text-vintage-brown">
                  {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-vintage-brown/70">ステータス</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white font-bold text-sm ${
                    statusColors[order.status] || 'bg-gray-500'
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
            </div>
          </div>

          {/* 配送先情報 */}
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              配送先
            </h2>

            <div className="space-y-2 text-vintage-brown">
              <p className="font-bold text-lg">{order.shippingName}</p>
              <p>〒{order.shippingPostalCode}</p>
              <p>
                {order.shippingPrefecture}
                {order.shippingCity}
                {order.shippingAddressLine1}
              </p>
              {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
              <p>電話: {order.shippingPhoneNumber}</p>
            </div>
          </div>

          {/* 注文商品 */}
          <div className="card-retro">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              注文商品
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b-2 border-vintage-brown last:border-b-0 last:pb-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="w-20 h-20 flex-shrink-0"
                  >
                    {item.product.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-retro border-2 border-vintage-brown hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full bg-vintage-brown/10 rounded-retro border-2 border-vintage-brown flex items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-vintage-brown hover:text-retro-blue"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-vintage-brown/70 mt-1">
                      ¥{item.price.toLocaleString()} × {item.quantity}個
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-vintage-brown">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* サイドバー: 料金明細 */}
        <div className="lg:col-span-1">
          <div className="card-retro sticky top-4">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              料金明細
            </h2>

            <div className="space-y-2 pb-4 border-b-2 border-vintage-brown">
              <div className="flex justify-between text-vintage-brown">
                <span>小計</span>
                <span className="font-bold">¥{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-vintage-brown">
                <span>送料</span>
                <span className="font-bold">
                  {order.shippingFee === 0
                    ? '無料'
                    : `¥${order.shippingFee.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-vintage-brown pt-4">
              <span>合計</span>
              <span className="text-retro-pink">
                ¥{order.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 p-4 bg-retro-blue/10 border-2 border-vintage-brown rounded-retro">
              <p className="text-sm text-vintage-brown">
                💡 ご質問がございましたら、お気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
