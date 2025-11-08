import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  // 統計情報を取得
  const [productsCount, categoriesCount, usersCount, ordersCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.order.count(),
  ])

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  const stats = [
    { name: '商品数', value: productsCount, icon: '📦', color: 'bg-retro-pink', href: '/admin/products' },
    { name: 'カテゴリ数', value: categoriesCount, icon: '🏷️', color: 'bg-retro-blue', href: '/admin/categories' },
    { name: 'ユーザー数', value: usersCount, icon: '👥', color: 'bg-retro-yellow' },
    { name: '注文数', value: ordersCount, icon: '🛒', color: 'bg-retro-purple' },
  ]

  return (
    <div>
      <h2 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
        ダッシュボード
      </h2>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="card-retro">
            {stat.href ? (
              <Link href={stat.href}>
                <div className={`${stat.color} text-white rounded-lg p-6 hover:scale-105 transition-transform`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl">{stat.icon}</span>
                    <span className="text-5xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-lg font-bold">{stat.name}</p>
                </div>
              </Link>
            ) : (
              <div className={`${stat.color} text-white rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{stat.icon}</span>
                  <span className="text-5xl font-bold">{stat.value}</span>
                </div>
                <p className="text-lg font-bold">{stat.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* クイックアクション */}
      <div className="card-retro mb-12">
        <h3 className="text-2xl font-bold text-vintage-brown mb-6 font-pixel">
          クイックアクション
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/products/new" className="btn-retro-pink text-center">
            ➕ 新しい商品を追加
          </Link>
          <Link href="/admin/categories" className="btn-retro-blue text-center">
            🏷️ カテゴリ管理
          </Link>
          <Link href="/admin/products" className="btn-retro-yellow text-center">
            📦 商品一覧を見る
          </Link>
        </div>
      </div>

      {/* 最近追加された商品 */}
      <div className="card-retro">
        <h3 className="text-2xl font-bold text-vintage-brown mb-6 font-pixel">
          最近追加された商品
        </h3>
        {recentProducts.length === 0 ? (
          <p className="text-vintage-brown text-center py-8">
            まだ商品がありません。最初の商品を追加しましょう！
          </p>
        ) : (
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center justify-between p-4 bg-vintage-cream rounded-retro hover:bg-retro-purple/20 transition-colors border-2 border-vintage-brown/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-retro-purple/20 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h4 className="font-bold text-vintage-brown">{product.name}</h4>
                    <p className="text-sm text-vintage-brown/70">{product.category.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-retro-pink">
                    ¥{Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-vintage-brown/70">在庫: {product.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
