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
    imageUrl: string | null
  }
}

interface Order {
  id: string
  totalAmount: number
  shippingFee: number
  status: string
  createdAt: string
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

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/orders')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) {
        throw new Error('注文の取得に失敗しました')
      }
      const data = await res.json()
      setOrders(data)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-4 font-pixel">
          注文履歴
        </h1>
        <Link href="/account" className="text-retro-blue hover:underline">
          ← アカウント設定に戻る
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card-retro text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-vintage-brown mb-4">
            注文履歴がありません
          </h2>
          <p className="text-vintage-brown mb-6">
            まだ商品を購入していません
          </p>
          <Link href="/products" className="btn-retro-pink inline-block">
            商品を見る
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card-retro">
              {/* 注文ヘッダー */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b-2 border-vintage-brown">
                <div>
                  <p className="text-sm text-vintage-brown/70">注文日</p>
                  <p className="font-bold text-vintage-brown">
                    {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-vintage-brown/70">注文番号</p>
                  <p className="font-mono text-sm text-vintage-brown">
                    {order.id.slice(0, 8)}...
                  </p>
                </div>

                <div>
                  <p className="text-sm text-vintage-brown/70">合計金額</p>
                  <p className="font-bold text-retro-pink text-xl">
                    ¥{order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                      statusColors[order.status] || 'bg-gray-500'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              {/* 注文アイテム */}
              <div className="py-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {item.product.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-retro border-2 border-vintage-brown"
                        />
                      ) : (
                        <div className="w-full h-full bg-vintage-brown/10 rounded-retro border-2 border-vintage-brown flex items-center justify-center text-xl">
                          📦
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-vintage-brown truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-vintage-brown/70">
                        数量: {item.quantity} × ¥{item.price.toLocaleString()}
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

              {/* アクション */}
              <div className="pt-4 border-t-2 border-vintage-brown">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="btn-retro-blue w-full md:w-auto text-center"
                >
                  注文詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
