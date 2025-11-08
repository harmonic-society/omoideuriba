import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

// 動的レンダリングを強制（ビルド時のプリレンダリングを無効化）
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-vintage-brown mb-8 font-pixel text-center">
            商品一覧
          </h1>

          {products.length === 0 ? (
            <div className="card-retro text-center py-12">
              <p className="text-2xl text-vintage-brown mb-4">
                まだ商品がありません
              </p>
              <p className="text-vintage-brown">
                近日公開予定！お楽しみに✨
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
