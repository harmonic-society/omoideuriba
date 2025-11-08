import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-retro-pink via-retro-purple to-retro-blue py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-pixel">
              思い出売場について
            </h1>
            <p className="text-xl text-white">
              懐かしいレトログッズの売買プラットフォーム
            </p>
          </div>
        </section>

        {/* メインコンテンツ */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* 思い出売場とは */}
            <div className="card-retro mb-8">
              <h2 className="text-3xl font-bold text-vintage-brown mb-6 font-pixel">
                🎮 思い出売場とは
              </h2>
              <div className="space-y-4 text-vintage-brown">
                <p className="text-lg">
                  思い出売場は、80年代から2000年代のレトログッズを愛する人たちのためのマーケットプレイスです。
                </p>
                <p>
                  お家に眠っている懐かしいおもちゃ、ゲーム、CD、フィギュアなど、
                  あなたの大切な思い出の品を必要としている人に届けることができます。
                </p>
                <p>
                  また、子供の頃に遊んでいたアイテムや、当時欲しかったけれど手に入らなかった
                  レトログッズを見つけて、懐かしい気持ちを呼び起こすことができます。
                </p>
              </div>
            </div>

            {/* 取り扱いカテゴリ */}
            <div className="card-retro mb-8">
              <h2 className="text-3xl font-bold text-vintage-brown mb-6 font-pixel">
                📦 取り扱いカテゴリ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-retro-pink/20 rounded-retro border-2 border-vintage-brown">
                  <div className="text-4xl mb-2">🎮</div>
                  <p className="font-bold text-vintage-brown">おもちゃ</p>
                </div>
                <div className="text-center p-4 bg-retro-blue/20 rounded-retro border-2 border-vintage-brown">
                  <div className="text-4xl mb-2">🕹️</div>
                  <p className="font-bold text-vintage-brown">ゲーム</p>
                </div>
                <div className="text-center p-4 bg-retro-yellow/20 rounded-retro border-2 border-vintage-brown">
                  <div className="text-4xl mb-2">💿</div>
                  <p className="font-bold text-vintage-brown">CD・レコード</p>
                </div>
                <div className="text-center p-4 bg-retro-purple/20 rounded-retro border-2 border-vintage-brown">
                  <div className="text-4xl mb-2">🎪</div>
                  <p className="font-bold text-vintage-brown">フィギュア</p>
                </div>
              </div>
            </div>

            {/* 安心・安全な取引 */}
            <div className="card-retro mb-8">
              <h2 className="text-3xl font-bold text-vintage-brown mb-6 font-pixel">
                💝 安心・安全な取引
              </h2>
              <div className="space-y-4 text-vintage-brown">
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">PayPal決済</h3>
                    <p>世界的に信頼されているPayPalを使用した安全な決済システム</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">📦</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">配送追跡</h3>
                    <p>注文状況をリアルタイムで確認できます</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">🛡️</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">購入者保護</h3>
                    <p>安心して取引できる環境を提供しています</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 始め方 */}
            <div className="card-retro mb-8">
              <h2 className="text-3xl font-bold text-vintage-brown mb-6 font-pixel">
                🚀 始め方
              </h2>
              <div className="space-y-6 text-vintage-brown">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-retro-pink text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">会員登録</h3>
                    <p>メールアドレスで簡単に登録できます（無料）</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">商品を探す</h3>
                    <p>カテゴリやキーワードから懐かしいアイテムを見つけよう</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-retro-yellow text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">購入する</h3>
                    <p>PayPalで安全に決済して、商品が届くのを待つだけ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <div className="card-retro bg-gradient-to-r from-retro-yellow/20 via-retro-pink/20 to-retro-purple/20">
                <h2 className="text-3xl font-bold text-vintage-brown mb-4 font-pixel">
                  今すぐ始めよう！
                </h2>
                <p className="text-vintage-brown mb-6">
                  懐かしい思い出の品を見つけて、新しい思い出を作りましょう
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/auth/signup" className="btn-retro-pink text-lg">
                    無料で会員登録
                  </Link>
                  <Link href="/products" className="btn-retro-blue text-lg">
                    商品を見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
