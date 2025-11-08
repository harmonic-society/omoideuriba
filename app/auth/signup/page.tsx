'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { signUpSchema, PREFECTURES, type SignUpInput } from '@/lib/validations/auth'
import { ZodError } from 'zod'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<SignUpInput>>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // フィールド変更時にそのフィールドのエラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      // フロントエンドバリデーション
      const validatedData = signUpSchema.parse(formData)

      setIsLoading(true)

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.error })
        } else {
          setErrors({ general: data.error || '登録に失敗しました' })
        }
        return
      }

      // 登録成功後、ログインページへリダイレクト
      router.push('/auth/signin?registered=true')
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: '登録に失敗しました' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card-retro">
              <h1 className="text-4xl font-bold text-vintage-brown mb-6 font-pixel text-center">
                新規登録
              </h1>

              {errors.general && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-retro mb-4">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本情報 */}
                <div className="border-2 border-vintage-brown rounded-retro p-4 bg-retro-purple/5">
                  <h2 className="text-xl font-bold text-vintage-brown mb-4">基本情報</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block font-bold text-vintage-brown mb-2">
                        お名前 <span className="text-retro-pink">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input-retro ${errors.name ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-bold text-vintage-brown mb-2">
                        メールアドレス <span className="text-retro-pink">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input-retro ${errors.email ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="block font-bold text-vintage-brown mb-2">
                        パスワード <span className="text-retro-pink">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input-retro ${errors.password ? 'border-red-500' : ''}`}
                        required
                        placeholder="英字と数字を含む8文字以上"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block font-bold text-vintage-brown mb-2">
                        パスワード（確認） <span className="text-retro-pink">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`input-retro ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block font-bold text-vintage-brown mb-2">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`input-retro ${errors.phoneNumber ? 'border-red-500' : ''}`}
                        placeholder="090-1234-5678"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 配送先情報（任意） */}
                <div className="border-2 border-vintage-brown rounded-retro p-4 bg-retro-blue/5">
                  <h2 className="text-xl font-bold text-vintage-brown mb-2">配送先情報（任意）</h2>
                  <p className="text-sm text-vintage-brown/70 mb-4">後から設定することもできます</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="postalCode" className="block font-bold text-vintage-brown mb-2">
                          郵便番号
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={`input-retro ${errors.postalCode ? 'border-red-500' : ''}`}
                          placeholder="123-4567"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="prefecture" className="block font-bold text-vintage-brown mb-2">
                          都道府県
                        </label>
                        <select
                          id="prefecture"
                          name="prefecture"
                          value={formData.prefecture}
                          onChange={handleChange}
                          className={`input-retro ${errors.prefecture ? 'border-red-500' : ''}`}
                        >
                          <option value="">選択してください</option>
                          {PREFECTURES.map((pref) => (
                            <option key={pref} value={pref}>
                              {pref}
                            </option>
                          ))}
                        </select>
                        {errors.prefecture && (
                          <p className="text-red-500 text-sm mt-1">{errors.prefecture}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block font-bold text-vintage-brown mb-2">
                        市区町村
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`input-retro ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="渋谷区"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block font-bold text-vintage-brown mb-2">
                        番地
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`input-retro ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="神南1-2-3"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="building" className="block font-bold text-vintage-brown mb-2">
                        建物名・部屋番号
                      </label>
                      <input
                        type="text"
                        id="building"
                        name="building"
                        value={formData.building}
                        onChange={handleChange}
                        className={`input-retro ${errors.building ? 'border-red-500' : ''}`}
                        placeholder="レトロマンション101"
                      />
                      {errors.building && (
                        <p className="text-red-500 text-sm mt-1">{errors.building}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-retro-pink text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '登録中...' : '登録する'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-vintage-brown">
                  既にアカウントをお持ちの方は{' '}
                  <Link href="/auth/signin" className="text-retro-pink hover:underline font-bold">
                    ログイン
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
