import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

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

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // ステータスごとの統計
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-vintage-brown font-pixel">
          注文管理
        </h2>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card-retro bg-retro-purple text-white">
          <p className="text-sm mb-1">総注文数</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="card-retro bg-yellow-500 text-white">
          <p className="text-sm mb-1">保留中</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="card-retro bg-blue-500 text-white">
          <p className="text-sm mb-1">処理中</p>
          <p className="text-3xl font-bold">{stats.processing}</p>
        </div>
        <div className="card-retro bg-purple-500 text-white">
          <p className="text-sm mb-1">発送済み</p>
          <p className="text-3xl font-bold">{stats.shipped}</p>
        </div>
        <div className="card-retro bg-green-500 text-white">
          <p className="text-sm mb-1">配達完了</p>
          <p className="text-3xl font-bold">{stats.delivered}</p>
        </div>
        <div className="card-retro bg-red-500 text-white">
          <p className="text-sm mb-1">キャンセル</p>
          <p className="text-3xl font-bold">{stats.cancelled}</p>
        </div>
      </div>

      {/* 注文一覧 */}
      <div className="card-retro">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-vintage-brown mb-4">注文はまだありません</p>
            <p className="text-vintage-brown/70">
              顧客が商品を購入すると、ここに表示されます。
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-vintage-brown">
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    注文ID
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    顧客
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    商品数
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    合計金額
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    ステータス
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    注文日時
                  </th>
                  <th className="text-left py-3 px-4 text-vintage-brown font-bold">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-vintage-brown/20 hover:bg-retro-purple/10 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-vintage-brown/70">
                        {order.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-vintage-brown">
                          {order.user.name}
                        </p>
                        <p className="text-sm text-vintage-brown/70">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-vintage-brown">
                      {order.items.length}点
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-retro-pink">
                        ¥{Number(order.totalAmount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-vintage-brown/70">
                      {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-retro-blue hover:text-retro-purple font-bold transition-colors"
                      >
                        詳細 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
