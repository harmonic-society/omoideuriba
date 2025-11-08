import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-vintage-brown mb-8 font-pixel text-center">
            カテゴリ一覧
          </h1>

          {categories.length === 0 ? (
            <div className="card-retro text-center py-12">
              <p className="text-2xl text-vintage-brown mb-4">
                カテゴリがまだありません
              </p>
              <p className="text-vintage-brown">
                近日追加予定です！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="card-retro hover:shadow-retro-lg transition-all transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-vintage-brown mb-3 font-pixel">
                      {category.name}
                    </h2>

                    {category.description && (
                      <p className="text-vintage-brown/80 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-vintage-brown/20">
                      <span className="text-vintage-brown font-bold">
                        {category._count.products}点の商品
                      </span>
                      <span className="text-retro-blue font-bold">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
