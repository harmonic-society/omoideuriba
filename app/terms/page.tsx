import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card-retro">
            <h1 className="text-4xl font-bold text-vintage-brown mb-8 font-pixel">
              利用規約
            </h1>

            <div className="space-y-8 text-vintage-brown">
              <section>
                <h2 className="text-2xl font-bold mb-4">第1条（適用）</h2>
                <p className="leading-relaxed">
                  本規約は、思い出売場（以下「当サイト」といいます）が提供するサービス（以下「本サービス」といいます）の利用条件を定めるものです。
                  ユーザーの皆様（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第2条（会員登録）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>本サービスの利用を希望する方は、本規約に同意の上、当サイトの定める方法によって会員登録を申請するものとします。</li>
                  <li>会員登録の申請は、必ず本サービスを利用する本人が行わなければなりません。</li>
                  <li>当サイトは、会員登録の申請者に以下の事由があると判断した場合、会員登録を承認しないことがあります。
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>本規約に違反したことがある者からの申請である場合</li>
                      <li>登録事項に虚偽、誤記または記載漏れがあった場合</li>
                      <li>その他、当サイトが会員登録を適当でないと判断した場合</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第3条（アカウント管理）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>ユーザーは、自己の責任において、本サービスのアカウント情報を適切に管理するものとします。</li>
                  <li>ユーザーは、いかなる場合にも、アカウント情報を第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                  <li>アカウント情報が第三者によって使用されたことによって生じた損害は、当サイトに故意又は重大な過失がある場合を除き、当サイトは一切の責任を負わないものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第4条（商品の購入と支払い）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>ユーザーは、当サイトが定める方法により、本サービスを通じて商品を購入することができます。</li>
                  <li>商品の代金支払いは、PayPalを通じて行うものとします。</li>
                  <li>商品購入の申し込みは、当サイトが申し込みを承諾した時点で契約が成立します。</li>
                  <li>購入した商品のキャンセル・返品については、別途定める返品ポリシーに従うものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第5条（禁止事項）</h2>
                <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>法令または公序良俗に違反する行為</li>
                  <li>犯罪行為に関連する行為</li>
                  <li>当サイトや他のユーザー、またはその他第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                  <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                  <li>不正アクセスをし、またはこれを試みる行為</li>
                  <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                  <li>不正な目的を持って本サービスを利用する行為</li>
                  <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
                  <li>その他、当サイトが不適切と判断する行為</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第6条（本サービスの提供の停止等）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                      <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                      <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                      <li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
                    </ul>
                  </li>
                  <li>当サイトは、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第7条（免責事項）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>当サイトは、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                  <li>当サイトは、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当サイトとユーザーとの間の契約が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                  <li>当サイトは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第8条（利用規約の変更）</h2>
                <p className="leading-relaxed">
                  当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                  変更後の本規約は、当サイトウェブサイトに掲載された時点から効力を生じるものとします。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">第9条（準拠法・裁判管轄）</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                  <li>本サービスに関して紛争が生じた場合には、当サイトの所在地を管轄する裁判所を専属的合意管轄とします。</li>
                </ol>
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
