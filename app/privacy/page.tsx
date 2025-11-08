import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card-retro">
            <h1 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
              プライバシーポリシー
            </h1>

            <div className="space-y-8 text-vintage-brown">
              <section>
                <p className="leading-relaxed mb-4">
                  思い出売場（以下「当サイト」といいます）は、ユーザーの個人情報について以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第1条（個人情報）</h2>
                <p className="leading-relaxed">
                  「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、
                  当該情報に含まれる氏名、メールアドレス、住所、電話番号その他の記述等により特定の個人を識別できる情報を指します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第2条（個人情報の収集方法）</h2>
                <p className="leading-relaxed mb-2">
                  当サイトは、ユーザーが利用登録をする際に、以下の個人情報をお尋ねすることがあります。
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>氏名</li>
                  <li>メールアドレス</li>
                  <li>住所</li>
                  <li>電話番号</li>
                  <li>配送先情報</li>
                  <li>決済情報（PayPalを通じて処理されます）</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第3条（個人情報を収集・利用する目的）</h2>
                <p className="leading-relaxed mb-2">
                  当サイトが個人情報を収集・利用する目的は、以下のとおりです。
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>本サービスの提供・運営のため</li>
                  <li>ユーザーからのお問い合わせに回答するため</li>
                  <li>商品の発送および配送状況の連絡のため</li>
                  <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内のため</li>
                  <li>メンテナンス、重要なお知らせなど必要に応じた連絡のため</li>
                  <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
                  <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
                  <li>上記の利用目的に付随する目的</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第4条（利用目的の変更）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。</li>
                  <li>利用目的の変更を行った場合には、変更後の目的について、当サイト所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第5条（個人情報の第三者提供）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>法令に基づく場合</li>
                      <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                      <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                      <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                    </ul>
                  </li>
                  <li>前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>当サイトが利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</li>
                      <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第6条（個人情報の開示）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあります。
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
                      <li>当サイトの業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
                      <li>その他法令に違反することとなる場合</li>
                    </ul>
                  </li>
                  <li>前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第7条（個人情報の訂正および削除）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>ユーザーは、当サイトの保有する自己の個人情報が誤った情報である場合には、当サイトが定める手続きにより、当サイトに対して個人情報の訂正、追加または削除（以下「訂正等」といいます）を請求することができます。</li>
                  <li>当サイトは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。</li>
                  <li>当サイトは、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第8条（個人情報の利用停止等）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます）を求められた場合には、遅滞なく必要な調査を行います。</li>
                  <li>前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。</li>
                  <li>当サイトは、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第9条（Cookie等の利用）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、Cookieおよび類似の技術を利用することがあります。これらの技術は、当サイトによる本サービスの利用状況等の把握に役立ち、サービス向上に資するものです。</li>
                  <li>Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することでCookieを無効化することができます。ただし、Cookieを無効化すると、本サービスの一部の機能が使用できなくなる場合があります。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第10条（プライバシーポリシーの変更）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。</li>
                  <li>当サイトが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第11条（お問い合わせ窓口）</h2>
                <p className="leading-relaxed">
                  本ポリシーに関するお問い合わせは、当サイトのお問い合わせフォームまでお願いいたします。
                </p>
              </section>

              <section className="pt-4 border-t-2 border-vintage-brown">
                <p className="text-sm">制定日：2024年11月8日</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
