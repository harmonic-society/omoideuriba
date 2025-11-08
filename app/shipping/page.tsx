import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card-retro">
            <h1 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
              配送について
            </h1>

            <div className="space-y-8 text-vintage-brown">
              {/* 配送方法 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>📦</span>
                  <span>配送方法</span>
                </h2>
                <p className="leading-relaxed mb-4">
                  当サイトでは、ヤマト運輸または日本郵便にて配送いたします。
                  配送業者の指定はできませんので、あらかじめご了承ください。
                </p>
                <div className="bg-retro-blue/10 border-2 border-vintage-brown rounded-retro p-4">
                  <p className="font-bold mb-2">配送業者</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>ヤマト運輸（宅急便）</li>
                    <li>日本郵便（ゆうパック）</li>
                  </ul>
                </div>
              </section>

              {/* 送料 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>💰</span>
                  <span>送料</span>
                </h2>
                <p className="leading-relaxed mb-4">
                  送料は配送先地域によって異なります。チェックアウト時に正確な送料が表示されます。
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-vintage-brown">
                    <thead className="bg-retro-pink text-white">
                      <tr>
                        <th className="border-2 border-vintage-brown px-4 py-3 text-left">配送先</th>
                        <th className="border-2 border-vintage-brown px-4 py-3 text-left">送料</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border-2 border-vintage-brown px-4 py-3">関東</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">500円</td>
                      </tr>
                      <tr className="bg-vintage-cream/50">
                        <td className="border-2 border-vintage-brown px-4 py-3">信越・北陸・東海</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">600円</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border-2 border-vintage-brown px-4 py-3">関西</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">700円</td>
                      </tr>
                      <tr className="bg-vintage-cream/50">
                        <td className="border-2 border-vintage-brown px-4 py-3">中国・四国</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">800円</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border-2 border-vintage-brown px-4 py-3">北海道・九州</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">900円</td>
                      </tr>
                      <tr className="bg-vintage-cream/50">
                        <td className="border-2 border-vintage-brown px-4 py-3">沖縄</td>
                        <td className="border-2 border-vintage-brown px-4 py-3 font-bold">1,200円</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm mt-4 bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro p-4">
                  ※ 商品のサイズや重量によって、追加料金が発生する場合があります。
                </p>
              </section>

              {/* お届け日数 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>⏰</span>
                  <span>お届け日数</span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-retro-purple/10 border-2 border-vintage-brown rounded-retro p-4">
                    <h3 className="font-bold text-lg mb-2">通常配送</h3>
                    <p className="leading-relaxed">
                      ご注文確定後、<span className="font-bold text-retro-pink">3〜7営業日</span>でお届けいたします。
                    </p>
                  </div>
                  <div className="bg-white border-2 border-vintage-brown rounded-retro p-4">
                    <h3 className="font-bold text-lg mb-2">配送の流れ</h3>
                    <ol className="space-y-2">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                          <p className="font-bold">ご注文確定</p>
                          <p className="text-sm">PayPal決済完了後、注文が確定します</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <div>
                          <p className="font-bold">発送準備（1〜3営業日）</p>
                          <p className="text-sm">商品の梱包・発送手配を行います</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <div>
                          <p className="font-bold">発送完了</p>
                          <p className="text-sm">発送完了メールをお送りします</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                        <div>
                          <p className="font-bold">お届け（発送後2〜4日）</p>
                          <p className="text-sm">ご指定の配送先にお届けします</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* 配送状況の確認 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🔍</span>
                  <span>配送状況の確認</span>
                </h2>
                <p className="leading-relaxed mb-4">
                  ご注文の配送状況は、マイページの「注文履歴」からいつでも確認できます。
                </p>
                <div className="bg-retro-pink/10 border-2 border-vintage-brown rounded-retro p-4">
                  <p className="font-bold mb-2">確認できる情報</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>注文ステータス（処理中、発送準備中、発送済み、配達完了）</li>
                    <li>配送予定日</li>
                    <li>追跡番号（発送後）</li>
                  </ul>
                </div>
              </section>

              {/* 配送に関する注意事項 */}
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>配送に関する注意事項</span>
                </h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">📅</span>
                    <div>
                      <p className="font-bold mb-1">土日祝日の配送</p>
                      <p className="text-sm leading-relaxed">土日祝日も配送を行っておりますが、配送業者の営業状況により遅延する場合があります。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">🏠</span>
                    <div>
                      <p className="font-bold mb-1">不在時の対応</p>
                      <p className="text-sm leading-relaxed">不在票が投函されますので、配送業者にご連絡の上、再配達をご依頼ください。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">🌍</span>
                    <div>
                      <p className="font-bold mb-1">海外配送</p>
                      <p className="text-sm leading-relaxed">現在、国内配送のみに対応しております。海外への配送は行っておりません。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">❄️</span>
                    <div>
                      <p className="font-bold mb-1">天候による遅延</p>
                      <p className="text-sm leading-relaxed">台風や大雪などの悪天候により、配送が遅延する場合があります。あらかじめご了承ください。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">📍</span>
                    <div>
                      <p className="font-bold mb-1">配送先の変更</p>
                      <p className="text-sm leading-relaxed">発送後の配送先変更はできません。ご注文前に配送先を十分ご確認ください。</p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* お問い合わせ */}
              <section className="bg-gradient-to-r from-retro-yellow/20 to-retro-blue/20 border-2 border-vintage-brown rounded-retro p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>💬</span>
                  <span>配送に関するお問い合わせ</span>
                </h2>
                <p className="leading-relaxed mb-4">
                  配送に関してご不明な点がございましたら、お気軽にお問い合わせください。
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• 商品が届かない</li>
                  <li>• 配送状況を確認したい</li>
                  <li>• 配送に関するその他のご質問</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
