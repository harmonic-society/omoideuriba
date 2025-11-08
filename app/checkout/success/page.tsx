'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('orderId')
    if (!id) {
      router.push('/')
      return
    }
    setOrderId(id)
  }, [searchParams, router])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
        <div className="text-vintage-brown text-xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* 成功メッセージ */}
        <div className="card-retro text-center">
          {/* アイコン */}
          <div className="text-8xl mb-6">🎉</div>

          <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-4 font-pixel">
            ご注文ありがとうございます！
          </h1>

          <p className="text-lg text-vintage-brown mb-8">
            ご注文を承りました。商品は3-7営業日以内に発送いたします。
          </p>

          {/* 注文番号 */}
          <div className="bg-retro-yellow/20 border-2 border-vintage-brown rounded-retro p-6 mb-8">
            <p className="text-sm text-vintage-brown/70 mb-2">注文番号</p>
            <p className="text-2xl font-bold text-vintage-brown font-mono break-all">
              {orderId}
            </p>
          </div>

          {/* 次のステップ */}
          <div className="bg-retro-purple/10 border-2 border-vintage-brown rounded-retro p-6 mb-8 text-left">
            <h2 className="font-bold text-vintage-brown mb-4 text-xl">📧 次のステップ</h2>
            <ul className="space-y-3 text-vintage-brown">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0">1.</span>
                <span>
                  ご登録のメールアドレスに注文確認メールをお送りします
                  <br />
                  <span className="text-sm text-vintage-brown/70">
                    （メールが届かない場合は、迷惑メールフォルダをご確認ください）
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0">2.</span>
                <span>商品の発送準備を開始します</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0">3.</span>
                <span>商品発送後、発送完了メールをお送りします</span>
              </li>
            </ul>
          </div>

          {/* アクションボタン */}
          <div className="space-y-4">
            <Link
              href={`/account/orders/${orderId}`}
              className="btn-retro-pink w-full block text-center"
            >
              注文詳細を見る
            </Link>

            <Link
              href="/products"
              className="btn-retro-blue w-full block text-center"
            >
              お買い物を続ける
            </Link>

            <Link
              href="/"
              className="block text-center text-retro-purple hover:underline font-bold"
            >
              トップページへ
            </Link>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 p-4 bg-retro-blue/10 border-2 border-vintage-brown rounded-retro">
          <h3 className="font-bold text-vintage-brown mb-2">💡 お知らせ</h3>
          <ul className="text-sm text-vintage-brown space-y-1 list-disc list-inside">
            <li>配送状況は注文詳細ページで確認できます</li>
            <li>ご質問がございましたら、お気軽にお問い合わせください</li>
            <li>レビューのご協力をお願いいたします</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-vintage-cream">
          <div className="text-vintage-brown text-xl">読み込み中...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
