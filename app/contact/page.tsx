'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact'
import { z } from 'zod'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // エラーをクリア
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitError('')
    setIsSubmitting(true)

    try {
      // クライアントサイドバリデーション
      contactFormSchema.parse(formData)

      // API送信
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          // Zodバリデーションエラー
          const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {}
          data.details.forEach((error: any) => {
            const field = error.path[0] as keyof ContactFormData
            fieldErrors[field] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setSubmitError(data.error || 'お問い合わせの送信に失敗しました')
        }
        return
      }

      // 成功時はthanksページへ遷移
      router.push('/contact/thanks')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ContactFormData
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
      } else {
        console.error('Contact form error:', error)
        setSubmitError('お問い合わせの送信に失敗しました。しばらく時間をおいて再度お試しください。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-vintage-cream py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card-retro">
            <h1 className="text-3xl md:text-4xl font-bold text-vintage-brown mb-6 md:mb-8 font-pixel text-center">
              お問い合わせ
            </h1>

            <p className="text-vintage-brown mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
              ご質問やご不明な点がございましたら、お気軽にお問い合わせください。
              通常、2〜3営業日以内にご返信いたします。
            </p>

            {submitError && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-6">
                <p className="font-bold mb-1">エラー</p>
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* お名前 */}
              <div>
                <label htmlFor="name" className="block text-vintage-brown font-bold mb-2 text-sm md:text-base">
                  お名前 <span className="text-retro-pink">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-retro w-full text-sm md:text-base ${errors.name ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  placeholder="山田 太郎"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-vintage-brown font-bold mb-2 text-sm md:text-base">
                  メールアドレス <span className="text-retro-pink">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-retro w-full text-sm md:text-base ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* 件名 */}
              <div>
                <label htmlFor="subject" className="block text-vintage-brown font-bold mb-2 text-sm md:text-base">
                  件名 <span className="text-retro-pink">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input-retro w-full text-sm md:text-base ${errors.subject ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  placeholder="商品について"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* お問い合わせ内容 */}
              <div>
                <label htmlFor="message" className="block text-vintage-brown font-bold mb-2 text-sm md:text-base">
                  お問い合わせ内容 <span className="text-retro-pink">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={8}
                  className={`input-retro w-full text-sm md:text-base resize-y ${errors.message ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  placeholder="お問い合わせ内容をご記入ください（10文字以上）"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-red-500 text-xs md:text-sm">{errors.message}</p>
                  )}
                  <p className="text-xs md:text-sm text-vintage-brown/70 ml-auto">
                    {formData.message.length} / 2000文字
                  </p>
                </div>
              </div>

              {/* 送信ボタン */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 md:py-4 rounded-retro font-bold text-base md:text-lg transition-all ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-retro-pink text-white hover:shadow-retro active:scale-95'
                  }`}
                >
                  {isSubmitting ? '送信中...' : '送信する'}
                </button>
              </div>
            </form>

            {/* お問い合わせに関する注意事項 */}
            <div className="mt-8 p-4 md:p-6 bg-retro-blue/10 border-2 border-vintage-brown rounded-retro">
              <h2 className="font-bold text-vintage-brown mb-3 text-sm md:text-base">お問い合わせに関する注意事項</h2>
              <ul className="space-y-2 text-xs md:text-sm text-vintage-brown">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>通常、2〜3営業日以内にご返信いたします</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>土日祝日のお問い合わせは、翌営業日以降の対応となります</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>お問い合わせ内容によっては、お時間をいただく場合がございます</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>迷惑メール設定により当店からの返信が届かない場合がございます。ドメイン受信設定をご確認ください</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
