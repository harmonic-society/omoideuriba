import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-retro-purple border-t-4 border-vintage-brown mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ショップ情報 */}
          <div>
            <h3 className="text-xl font-bold text-vintage-brown mb-4 font-pixel">
              思い出売場
            </h3>
            <p className="text-vintage-brown text-sm">
              懐かしいレトログッズを売り買いできる<br />
              レトロポップなECサイト
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="font-bold text-vintage-brown mb-4">リンク</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  商品一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h4 className="font-bold text-vintage-brown mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-vintage-brown hover:text-retro-pink transition-colors">
                  配送について
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-vintage-brown mt-8 pt-6 text-center">
          <p className="text-sm text-vintage-brown">
            &copy; 2024 思い出売場 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
