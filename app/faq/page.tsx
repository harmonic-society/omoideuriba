import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const faqs = [
    {
      category: '会員登録・アカウント',
      questions: [
        {
          q: '会員登録は無料ですか？',
          a: 'はい、会員登録は完全無料です。メールアドレスとパスワードを設定するだけで、すぐにご利用いただけます。',
        },
        {
          q: 'パスワードを忘れてしまいました',
          a: 'ログイン画面の「パスワードをお忘れの方」からパスワードリセットの手続きを行ってください。登録されているメールアドレスにリセット用のリンクをお送りします。',
        },
        {
          q: '登録情報を変更したい',
          a: 'マイページから「アカウント設定」にアクセスして、登録情報を変更できます。',
        },
        {
          q: '退会したい',
          a: 'マイページの「アカウント設定」から退会手続きが可能です。退会後も過去の取引履歴は一定期間保管されます。',
        },
      ],
    },
    {
      category: '商品の購入',
      questions: [
        {
          q: '支払い方法は何がありますか？',
          a: '現在、PayPal決済のみに対応しています。クレジットカード、デビットカード、PayPal残高でのお支払いが可能です。',
        },
        {
          q: '商品はいつ届きますか？',
          a: 'ご注文確定後、通常3〜7営業日でお届けします。配送状況はマイページの注文履歴から確認できます。',
        },
        {
          q: '送料はいくらですか？',
          a: '配送先によって異なりますが、通常500円〜です。チェックアウト時に正確な送料が表示されます。',
        },
        {
          q: '注文をキャンセルしたい',
          a: '発送前であればキャンセル可能です。マイページの注文履歴から該当の注文を選択し、お問い合わせください。発送後のキャンセルはできません。',
        },
        {
          q: '商品が届きません',
          a: 'まず配送状況をご確認ください。配送予定日を過ぎても届かない場合は、お問い合わせフォームからご連絡ください。',
        },
      ],
    },
    {
      category: '返品・交換',
      questions: [
        {
          q: '返品はできますか？',
          a: '商品到着後7日以内であれば、未開封・未使用の商品に限り返品を受け付けます。返品をご希望の場合は、お問い合わせフォームからご連絡ください。',
        },
        {
          q: '商品が破損していました',
          a: '配送中の破損が確認された場合は、商品到着後7日以内にお問い合わせください。状況を確認の上、交換または返金対応いたします。',
        },
        {
          q: '商品が説明と違います',
          a: '商品説明と異なる商品が届いた場合は、商品到着後7日以内にお問い合わせください。状況を確認の上、交換または返金対応いたします。',
        },
        {
          q: '返品時の送料は誰が負担しますか？',
          a: '商品に不備がある場合は当サイトが負担します。お客様都合による返品の場合は、お客様のご負担となります。',
        },
      ],
    },
    {
      category: '商品について',
      questions: [
        {
          q: 'どんな商品を扱っていますか？',
          a: '80年代から2000年代のレトログッズを中心に、おもちゃ、ゲーム、CD・レコード、フィギュアなどを取り扱っています。',
        },
        {
          q: '中古品ですか？新品ですか？',
          a: '両方取り扱っています。商品ページに状態の詳細が記載されていますので、ご購入前に必ずご確認ください。',
        },
        {
          q: '商品の状態について詳しく知りたい',
          a: '各商品ページに商品の状態を詳しく記載しています。不明点がある場合は、お問い合わせフォームからご質問ください。',
        },
        {
          q: '在庫切れの商品は再入荷しますか？',
          a: 'レトログッズは希少性が高いため、再入荷の予定は未定です。入荷情報を知りたい場合は、会員登録してメールマガジンをご購読ください。',
        },
      ],
    },
    {
      category: 'その他',
      questions: [
        {
          q: '領収書は発行できますか？',
          a: 'PayPalから発行される決済明細書をご利用ください。別途領収書が必要な場合は、お問い合わせフォームからご依頼ください。',
        },
        {
          q: '海外への配送はできますか？',
          a: '現在、国内配送のみに対応しています。',
        },
        {
          q: 'ギフト包装はできますか？',
          a: '現在、ギフト包装サービスは提供しておりません。',
        },
        {
          q: '問い合わせの返信はどのくらいで来ますか？',
          a: '通常、営業日の2〜3日以内にご返信いたします。お急ぎの場合は、お問い合わせ内容にその旨をご記載ください。',
        },
      ],
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card-retro mb-8">
            <h1 className="text-4xl font-bold text-vintage-brown mb-4 font-pixel">
              よくある質問
            </h1>
            <p className="text-vintage-brown">
              お客様からよくいただくご質問をまとめました。
              こちらで解決しない場合は、お問い合わせフォームからご連絡ください。
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="card-retro">
                <h2 className="text-2xl font-bold text-vintage-brown mb-6 pb-3 border-b-2 border-vintage-brown font-pixel">
                  {category.category}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="space-y-2">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-blue text-white rounded-full flex items-center justify-center font-bold">
                          Q
                        </span>
                        <h3 className="font-bold text-vintage-brown pt-1 text-lg">
                          {faq.q}
                        </h3>
                      </div>
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-retro-pink text-white rounded-full flex items-center justify-center font-bold">
                          A
                        </span>
                        <p className="text-vintage-brown pt-1 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card-retro mt-8 bg-gradient-to-r from-retro-yellow/20 to-retro-pink/20">
            <h2 className="text-2xl font-bold text-vintage-brown mb-4 font-pixel">
              📧 お問い合わせ
            </h2>
            <p className="text-vintage-brown mb-4">
              上記で解決しない問題やご不明な点がございましたら、
              お気軽にお問い合わせください。
            </p>
            <p className="text-vintage-brown text-sm">
              ※お問い合わせへの返信には、営業日で2〜3日程度お時間をいただいております。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
