import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderStatusForm from '@/components/admin/OrderStatusForm'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// ステータスの日本語表示
const statusLabels: Record<string, string> = {
  PENDING: '保留中',
  PROCESSING: '処理中',
  SHIPPED: '発送済み',
  DELIVERED: '配達完了',
  CANCELLED: 'キャンセル',
}

// ステータスの色
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-retro-blue hover:text-retro-purple font-bold mb-4 inline-block"
        >
          ← 注文一覧に戻る
        </Link>
        <h2 className="text-4xl font-bold text-vintage-brown font-pixel">
          注文詳細
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側: 注文情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 注文基本情報 */}
          <div className="card-retro">
            <h3 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              注文情報
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-vintage-brown/20">
                <span className="text-vintage-brown/70">注文ID</span>
                <span className="font-mono text-sm font-bold text-vintage-brown">
                  {order.id}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-vintage-brown/20">
                <span className="text-vintage-brown/70">注文日時</span>
                <span className="font-bold text-vintage-brown">
                  {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-vintage-brown/20">
                <span className="text-vintage-brown/70">ステータス</span>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${
                    statusColors[order.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              {order.paypalOrderId && (
                <div className="flex items-center justify-between py-2 border-b border-vintage-brown/20">
                  <span className="text-vintage-brown/70">PayPal注文ID</span>
                  <span className="font-mono text-sm text-vintage-brown">
                    {order.paypalOrderId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 顧客情報 */}
          <div className="card-retro">
            <h3 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              顧客情報
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-vintage-brown/70 mb-1">氏名</p>
                <p className="font-bold text-vintage-brown">{order.user.name}</p>
              </div>

              <div>
                <p className="text-sm text-vintage-brown/70 mb-1">メールアドレス</p>
                <p className="text-vintage-brown">{order.user.email}</p>
              </div>

              {order.user.phoneNumber && (
                <div>
                  <p className="text-sm text-vintage-brown/70 mb-1">電話番号</p>
                  <p className="text-vintage-brown">{order.user.phoneNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* 配送先情報 */}
          <div className="card-retro">
            <h3 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              配送先情報
            </h3>

            <div className="space-y-2 text-vintage-brown">
              <p className="font-bold text-lg">{order.shippingName}</p>
              <p>〒{order.shippingPostalCode}</p>
              <p>
                {order.shippingPrefecture}
                {order.shippingCity}
                {order.shippingAddressLine1}
              </p>
              {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
              <p className="pt-2">電話: {order.shippingPhoneNumber}</p>
            </div>
          </div>

          {/* 注文商品 */}
          <div className="card-retro">
            <h3 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              注文商品
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-vintage-cream rounded-retro border-2 border-vintage-brown/20"
                >
                  {item.product.imageUrl && (
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-vintage-brown hover:text-retro-purple transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-vintage-brown/70 mt-1">
                      数量: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-vintage-brown/70">単価</p>
                    <p className="font-bold text-vintage-brown">
                      ¥{Number(item.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-retro-pink mt-1">
                      小計: ¥{(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右側: 金額とアクション */}
        <div className="lg:col-span-1 space-y-6">
          {/* 金額サマリー */}
          <div className="card-retro">
            <h3 className="text-xl font-bold text-vintage-brown mb-4 font-pixel">
              金額
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-vintage-brown/70">小計</span>
                <span className="text-vintage-brown">
                  ¥
                  {(
                    Number(order.totalAmount) - Number(order.shippingFee)
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-vintage-brown/70">送料</span>
                <span className="text-vintage-brown">
                  ¥{Number(order.shippingFee).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-t-2 border-vintage-brown">
                <span className="font-bold text-vintage-brown">合計</span>
                <span className="text-2xl font-bold text-retro-pink">
                  ¥{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ステータス変更 */}
          <div className="card-retro">
            <h3 className="text-xl font-bold text-vintage-brown mb-4 font-pixel">
              ステータス変更
            </h3>

            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  )
}
