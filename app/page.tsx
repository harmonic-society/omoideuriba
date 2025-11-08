import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // 新着商品（最新8件）
  const newProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  // おすすめ商品（最大8件）
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-retro-pink via-retro-purple to-retro-blue py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-pixel animate-bounce-retro">
              ようこそ思い出売場へ
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 font-retro">
              懐かしいレトログッズを売り買いしよう！
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products" className="btn-retro-yellow text-lg">
                🛍️ 商品を見る
              </Link>
              <Link href="/auth/signup" className="btn-retro-blue text-lg">
                ✨ 今すぐ登録
              </Link>
            </div>
          </div>
        </section>

        {/* おすすめ商品セクション */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-gradient-to-r from-retro-yellow/20 via-retro-pink/20 to-retro-purple/20">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center text-vintage-brown mb-12 font-pixel">
                ⭐ おすすめアイテム
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/products" className="btn-retro-pink inline-block">
                  もっと見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 新着商品セクション */}
        {newProducts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-4xl font-bold text-center text-vintage-brown mb-12 font-pixel">
                🆕 ニューアイテム
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/products" className="btn-retro-blue inline-block">
                  すべての商品を見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* カテゴリセクション */}
        <section className="py-16 bg-retro-purple/20">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-center text-vintage-brown mb-12 font-pixel">
              人気カテゴリ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="card-retro text-center hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h4 className="font-bold text-vintage-brown">{category.name}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20 bg-gradient-to-r from-retro-yellow via-retro-orange to-retro-pink">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-pixel">
              あなたの思い出を売買しよう
            </h3>
            <p className="text-xl text-white mb-8">
              今すぐ会員登録して、レトロな世界へ飛び込もう！
            </p>
            <Link href="/auth/signup" className="inline-block bg-white text-retro-pink px-8 py-4 rounded-retro font-bold text-lg shadow-retro hover:shadow-retro-hover transition-all">
              無料で会員登録
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

const categories = [
  { name: 'おもちゃ', slug: 'toys', emoji: '🎮' },
  { name: '雑貨', slug: 'goods', emoji: '🎀' },
  { name: 'ゲーム', slug: 'games', emoji: '🕹️' },
  { name: 'CD・レコード', slug: 'music', emoji: '💿' },
  { name: '本・雑誌', slug: 'books', emoji: '📚' },
  { name: 'フィギュア', slug: 'figures', emoji: '🎪' },
  { name: 'ファッション', slug: 'fashion', emoji: '👗' },
  { name: 'その他', slug: 'others', emoji: '✨' },
]
