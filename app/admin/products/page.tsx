import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductTable from '@/components/admin/ProductTable'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      {/* ページヘッダー - モバイル対応 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-vintage-brown font-pixel">
          商品管理
        </h2>
        <Link href="/admin/products/new" className="btn-retro-pink w-full sm:w-auto text-center">
          ➕ 新しい商品を追加
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-retro text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-vintage-brown mb-4">
            商品がまだありません
          </h3>
          <p className="text-vintage-brown mb-6">
            最初の商品を追加してショップを始めましょう！
          </p>
          <Link href="/admin/products/new" className="btn-retro-pink inline-block">
            ➕ 商品を追加
          </Link>
        </div>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  )
}
