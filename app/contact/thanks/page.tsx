import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactThanksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="card-retro text-center py-12 md:py-16 max-w-2xl mx-auto">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6">✉️</div>

            <h1 className="text-3xl md:text-5xl font-bold text-vintage-brown mb-4 md:mb-6 font-pixel">
              送信完了
            </h1>

            <p className="text-base md:text-xl text-vintage-brown mb-6 md:mb-8 leading-relaxed">
              お問い合わせありがとうございます。
              <br />
              内容を確認次第、ご連絡させていただきます。
            </p>

            <div className="bg-retro-blue/10 border-2 border-vintage-brown rounded-retro p-4 md:p-6 mb-6 md:mb-8 text-left">
              <h2 className="font-bold text-vintage-brown mb-3 md:mb-4 text-base md:text-lg">
                今後の流れ
              </h2>
              <ol className="space-y-2 md:space-y-3 text-sm md:text-base text-vintage-brown">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                    1
                  </span>
                  <div>
                    <p className="font-bold">自動返信メールの確認</p>
                    <p className="text-xs md:text-sm text-vintage-brown/80 mt-1">
                      ご入力いただいたメールアドレスに自動返信メールをお送りしております
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                    2
                  </span>
                  <div>
                    <p className="font-bold">内容確認（1〜2営業日）</p>
                    <p className="text-xs md:text-sm text-vintage-brown/80 mt-1">
                      担当者がお問い合わせ内容を確認いたします
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                    3
                  </span>
                  <div>
                    <p className="font-bold">ご返信（2〜3営業日以内）</p>
                    <p className="text-xs md:text-sm text-vintage-brown/80 mt-1">
                      メールにてご返信させていただきます
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro p-4 md:p-5 mb-6 md:mb-8">
              <p className="text-xs md:text-sm text-vintage-brown leading-relaxed">
                <span className="font-bold">📧 メールが届かない場合</span>
                <br />
                迷惑メールフォルダをご確認いただくか、
                <br className="md:hidden" />
                ドメイン受信設定をご確認ください。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/"
                className="btn-retro-pink text-base md:text-lg inline-block"
              >
                トップページへ
              </Link>
              <Link
                href="/products"
                className="btn-retro-blue text-base md:text-lg inline-block"
              >
                商品を見る
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
