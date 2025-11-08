import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  // カテゴリを取得
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        include: {
          category: true
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4">
          {/* パンくずリスト */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-retro-blue hover:underline">
              ホーム
            </Link>
            <span className="mx-2 text-vintage-brown">/</span>
            <Link href="/categories" className="text-retro-blue hover:underline">
              カテゴリ
            </Link>
            <span className="mx-2 text-vintage-brown">/</span>
            <span className="text-vintage-brown font-bold">{category.name}</span>
          </nav>

          {/* カテゴリヘッダー */}
          <div className="card-retro mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-vintage-brown mb-4 font-pixel">
              {category.name}
            </h1>

            {category.description && (
              <p className="text-lg text-vintage-brown/80 mb-4">
                {category.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-vintage-brown/60">
              <span>📦 {category.products.length}点の商品</span>
            </div>
          </div>

          {/* 商品一覧 */}
          {category.products.length === 0 ? (
            <div className="card-retro text-center py-12">
              <p className="text-2xl text-vintage-brown mb-4">
                このカテゴリにはまだ商品がありません
              </p>
              <Link
                href="/categories"
                className="inline-block btn-retro-blue mt-4"
              >
                他のカテゴリを見る
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product) => (
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
